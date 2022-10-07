import { Inject, Injectable, Logger } from '@nestjs/common';
import { Replies } from 'amqplib';
import { ClassConstructor } from 'class-transformer';
import delay from 'delay';
import md5 from 'md5';
import { config } from '../config';
import { Define } from '../define';
import { RabbitmqConfig } from '../rabbitmq/rabbitmq.config';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { RedisService } from '../redis/redis.service';
import { TaskManager } from '../task/task.manager';
import { TaskService } from '../task/task.service';
import { AJob, ATask } from '../task/task/a.task';
import { BJob, BTask } from '../task/task/b.task';
import { HandlerGroup } from './worker.schema';

@Injectable()
export class WorkerService {
  private readonly _logger = new Logger(WorkerService.name);

  private _consumer?: Replies.Consume;
  private _taskCount = 0;

  constructor(
    private readonly _queueService: RabbitmqService,
    private readonly _taskManager: TaskManager,
    private readonly _taskService: TaskService,
    private readonly _redisService: RedisService,

    @Inject(Define.providerToken.handlerGroup)
    private readonly _handlerGroup: HandlerGroup<unknown>,
    @Inject(Define.providerToken.workerQueue)
    private readonly _workerQueue: RabbitmqConfig,
    @Inject(Define.providerToken.task)
    private readonly _task: ClassConstructor<ATask | BTask>,
  ) {}

  hc() {
    return this._queueService.hc();
  }

  async gracefulShutdown() {
    const ch = await this._queueService.getChannel();
    if (this._consumer?.consumerTag) {
      await ch.cancel(this._consumer.consumerTag);
    }
    await this._waitUntilTaskDone();
  }

  private async _waitUntilTaskDone(attempts = 0) {
    if (this._taskCount === 0) {
      this._logger.log('all task done, bye');
      return;
    }

    if (attempts < 10) {
      this._logger.warn(
        `shutdown delay ${++attempts} times because of ${
          this._taskCount
        } pending task`,
      );
      await delay(3000);
      await this._waitUntilTaskDone(attempts);
    } else {
      this._logger.error(
        `ignore ${this._taskCount} pending task and force shutdown`,
      );
    }
  }

  async deployWorker() {
    const daemon = this._registerConsumer.bind(this);
    await daemon();
    // always register consumer before set it as daemon or you might execute it twice
    this._queueService.setDaemon(daemon);
  }

  private async _registerConsumer() {
    const { name, consumeOptions } = this._workerQueue;
    const channel = await this._queueService.getChannel();
    await channel.prefetch(config.prefetch);
    this._consumer = await channel.consume(
      name,
      async (msg) => {
        if (!msg) {
          return;
        }

        this._taskCount++;

        try {
          const task = msg.content.toString();
          const hash = md5(task);
          await this._taskHandler(task).catch(console.log);
          if (await this._redisService.preempt(hash, 60)) {
            this._logger.log(task);
            await this._taskHandler(task).catch(console.log);
            await this._redisService.client.del(hash);
          } else {
            console.log(new Error('duplicated task'));
          }
        } catch (e) {
          console.log(e);
        }

        if (!consumeOptions?.noAck) {
          channel.ack(msg);
        }

        this._taskCount--;
      },

      consumeOptions,
    );
  }

  private async _taskHandler(taskMessage: string) {
    const { jobList } = await this._taskService.generalTranslator.deserialize<
      AJob | BJob
    >(taskMessage);

    for (const jobs of jobList) {
      await Promise.all(
        jobs.map(async (job) => {
          await this._handlerGroup.handle(job).catch(async (err) => {
            if (job.retry?.limit && job.retry.limit > 0) {
              job.retry.limit--;

              await this._taskManager.assign(this._task, job, {
                delay: job.retry.delay,
              });
            }

            if (job.ignoreException) {
              console.log(err);
            } else {
              // stop the next process
              throw err;
            }
          });
        }),
      );
    }
  }
}
