import { Global, Module, Provider } from '@nestjs/common';
import { config } from '../config';
import { TaskManager, TaskManagerMock } from './task.manager';
import { TaskService } from './task.service';
import { GeneralTranslator } from './translator/general.translator';

const TaskManagerProvider: Provider = {
  provide: TaskManager,
  useClass: config.nodeEnv === 'test' ? TaskManagerMock : TaskManager,
};

@Global()
@Module({
  imports: [],
  providers: [
    TaskService,
    TaskManagerProvider,
    // translator
    GeneralTranslator,
  ],

  exports: [TaskService, TaskManagerProvider],
})
export class TaskModule {}
