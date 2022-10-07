import {
  DynamicModule,
  Module,
  OnModuleDestroy,
  OnModuleInit,
  Provider,
  Type,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { createServer } from 'net';
import { config } from '../config';
import { Define } from '../define';
import { RabbitmqConfig } from '../rabbitmq/rabbitmq.config';
import { RedisModule } from '../redis/redis.module';
import { PubTask } from '../task/task.define';
import { HandlerGroup } from './worker.schema';
import { WorkerService } from './worker.service';

@Module({
  imports: [RedisModule],
})
export class WorkerModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly _workerService: WorkerService) {}

  static forRoot(provider: WorkerProvider): DynamicModule {
    const providers: Provider[] = [
      WorkerService,
      {
        provide: Define.providerToken.handlerGroup,
        useExisting: provider.handlerGroup,
      },
      {
        provide: Define.providerToken.workerQueue,
        useValue: provider.workerQueue,
      },
      {
        provide: Define.providerToken.task,
        useClass: provider.task,
      },
    ];

    return {
      module: WorkerModule,
      imports: [provider.handlerModule],
      providers,
    };
  }

  async onModuleInit() {
    if (config.nodeEnv === 'test') {
      // disable hc in test mode
      return;
    }

    if (config.nodeEnv !== 'dev') {
      process
        .on('uncaughtException', console.error)
        .on('unhandledRejection', console.error);
    }

    // use synchronous api is bad usually,
    // however this `init scope` will be executed always only once
    if (existsSync(config.hcDomainSocketPath)) {
      await unlink(config.hcDomainSocketPath);
    }

    // create ipc server to receive hc command
    createServer((stream) => {
      stream.on('data', async () => {
        const exitCode = (await this._workerService.hc()) ? '0' : '1';
        stream.write(exitCode);
      });
    })
      .listen(config.hcDomainSocketPath)
      .on('error', console.error);

    await this._workerService.deployWorker();
  }

  async onModuleDestroy() {
    if (config.nodeEnv === 'test') {
      // disable graceful shutdown in test mode
      return;
    }

    await this._workerService.gracefulShutdown();
  }
}

type WorkerProvider = {
  handlerGroup: ClassConstructor<HandlerGroup<unknown>>;
  handlerModule: Type<any>;
  task: ClassConstructor<PubTask<unknown>>;
  workerQueue: RabbitmqConfig;
};
