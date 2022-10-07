import { Module, Provider } from '@nestjs/common';
import { aWorkerQueueConfig } from '../rabbitmq/config/a-worker.queue';
import { bWorkerQueueConfig } from '../rabbitmq/config/b-worker.queue';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { TaskModule } from '../task/task.module';
import { ATask } from '../task/task/a.task';
import { BTask } from '../task/task/b.task';
import { WorkerModule } from '../worker/worker.module';
import { AWorkerHandlerGroup } from './a.handler-group';
import { BWorkerHandlerGroup } from './b.handler-group';
import { DemoService } from './demo.service';
import { A1JobHandler } from './handler/a/a1.handler';
import { A2JobHandler } from './handler/a/a2.handler';
import { B1JobHandler } from './handler/b/b1.handler';
import { B2JobHandler } from './handler/b/b2.handler';

const AWorkerProviders: Provider[] = [
  AWorkerHandlerGroup,
  // handler
  A1JobHandler,
  A2JobHandler,
];

@Module({
  imports: [RabbitmqModule.forRoot([aWorkerQueueConfig, bWorkerQueueConfig])],
  exports: [AWorkerHandlerGroup],
  providers: AWorkerProviders,
})
class AWorkerHandlerModule {}

const BWorkerProviders: Provider[] = [
  BWorkerHandlerGroup,
  // handler
  B1JobHandler,
  B2JobHandler,
];

@Module({
  imports: [RabbitmqModule.forRoot([bWorkerQueueConfig, bWorkerQueueConfig])],
  exports: [BWorkerHandlerGroup],
  providers: BWorkerProviders,
})
class BWorkerHandlerModule {}

@Module({
  imports: [
    TaskModule,
    WorkerModule.forRoot({
      handlerGroup: AWorkerHandlerGroup,
      handlerModule: AWorkerHandlerModule,
      workerQueue: aWorkerQueueConfig,
      task: ATask,
    }),
    WorkerModule.forRoot({
      handlerGroup: BWorkerHandlerGroup,
      handlerModule: BWorkerHandlerModule,
      workerQueue: bWorkerQueueConfig,
      task: BTask,
    }),
  ],
  providers: [DemoService],
})
export class DemoModule {}
