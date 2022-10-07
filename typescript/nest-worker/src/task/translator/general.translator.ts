import { Injectable } from '@nestjs/common';
import { deserialize, serialize } from 'class-transformer';
import { validate } from 'class-validator';
import { SubTask } from '../task.define';
import { TaskTranslator } from '../task.schema';
import { ATask } from '../task/a.task';
import { BTask } from '../task/b.task';

@Injectable()
export class GeneralTranslator implements TaskTranslator {
  serialize(task: ATask | BTask): Buffer {
    if (!task.name) {
      task.name = task.jobList
        .map((job) => job.map((x) => x.handler).join('.'))
        .join('.');
    }
    return Buffer.from(
      serialize({
        name: task.name,
        jobList: task.jobList,
      }),
    );
  }

  async deserialize<T>(msg: string): Promise<SubTask<T>> {
    const task = deserialize<SubTask<T>>(SubTask, msg);
    const exceptions = await validate(task);
    if (exceptions.length) {
      throw new Error(msg);
    }
    return task;
  }
}
