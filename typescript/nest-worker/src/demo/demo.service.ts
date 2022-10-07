import { Injectable, OnModuleInit } from '@nestjs/common';
import { TaskManager } from '../task/task.manager';
import { ATask } from '../task/task/a.task';
import { BTask } from '../task/task/b.task';

@Injectable()
export class DemoService implements OnModuleInit {
  constructor(private readonly _taskManager: TaskManager) {}

  onModuleInit() {
    const taskA = this._taskManager.createTask(ATask);
    taskA.add({ handler: 'a1JobHandler', param: ['a1'] }).add([
      { handler: 'a1JobHandler', param: ['a1'] },
      { handler: 'a2JobHandler', param: ['a', 2] },
    ]);

    const taskB = this._taskManager.createTask(BTask);
    taskB.add([
      { handler: 'b1JobHandler', param: [{ name: 'b1' }] },
      { handler: 'b2JobHandler', param: [] },
    ]);

    Promise.all([
      this._taskManager.commit(taskA),
      this._taskManager.commit(taskB),
    ]);
  }
}
