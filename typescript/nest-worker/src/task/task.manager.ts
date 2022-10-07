import { Injectable } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { aWorkerQueueConfig } from '../rabbitmq/config/a-worker.queue';
import { bWorkerQueueConfig } from '../rabbitmq/config/b-worker.queue';
import {
  RabbitmqConfig,
  workerDelayExchange,
} from '../rabbitmq/rabbitmq.config';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { PubTask } from './task.define';
import { TaskTranslator } from './task.schema';
import { AJob, ATask } from './task/a.task';
import { BJob, BTask } from './task/b.task';
import { GeneralTranslator } from './translator/general.translator';

@Injectable()
export class TaskManager {
  constructor(
    private readonly _queueService: RabbitmqService,
    private readonly _generalTranslator: GeneralTranslator,
  ) {}

  createTask<T extends TaskType>(task: ClassConstructor<T>, name?: string): T {
    return new task(name);
  }

  async commit(task: PubTask<unknown>, options?: CommitOptions) {
    if (!task.jobList.length) {
      return;
    }

    const { queueConfig, translator } = this._getMappingInstruction(task);
    const channel = await this._queueService.getChannel();
    const msg = translator.serialize(task);

    if (options?.delay) {
      channel.publish(
        workerDelayExchange.name,
        queueConfig.delayExchangeRouteKey,
        msg,
        {
          ...queueConfig.publishOptions,
          headers: {
            'x-delay': options.delay,
          },
        },
      );
    } else {
      channel.sendToQueue(queueConfig.name, msg, queueConfig.publishOptions);
    }
  }

  private _getMappingInstruction(task: PubTask<unknown>): Instruction {
    switch (task.constructor) {
      case ATask:
        return {
          queueConfig: aWorkerQueueConfig,
          translator: this._generalTranslator,
        };
      case BTask:
        return {
          queueConfig: bWorkerQueueConfig,
          translator: this._generalTranslator,
        };

      default:
        throw new Error('unknown task type');
    }
  }

  async assign<T extends TaskType>(
    type: ClassConstructor<T>,
    job: JobType<T>,
    options?: CommitOptions,
  ) {
    const task = this.createTask<T>(type);
    // @ts-ignore: job type is constraint by param type
    task.add(job);
    await this.commit(task, options);
  }
}

export class TaskManagerMock extends TaskManager {
  private readonly _taskList: TaskMock[] = [];

  async commit(task: PubTask<unknown>, options?: CommitOptions): Promise<void> {
    if (task.jobList.length === 0) {
      await Promise.resolve();
      return;
    }

    this._taskList.push({
      task,
      options,
    });
  }

  getTaskList(): TaskMock[] {
    // remove method
    return JSON.parse(JSON.stringify(this._taskList));
  }

  purge() {
    // clear all task
    this._taskList.length = 0;
  }
}

type CommitOptions = {
  /**
   * @description delay to publish message in `ms`
   */
  delay?: number;
};

type Instruction = {
  queueConfig: RabbitmqConfig;
  translator: TaskTranslator;
};

export type TaskType = ATask | BTask;

export type JobType<T extends TaskType> = T extends ATask
  ? AJob
  : T extends BTask
  ? BJob
  : void;

type TaskMock = {
  task: PubTask<unknown>;
  options?: CommitOptions;
};
