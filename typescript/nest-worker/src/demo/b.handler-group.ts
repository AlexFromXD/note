import { Injectable } from '@nestjs/common';
import { BJob } from '../task/task/b.task';
import { HandlerGroup } from '../worker/worker.schema';
import { B1JobHandler } from './handler/b/b1.handler';
import { B2JobHandler } from './handler/b/b2.handler';

@Injectable()
export class BWorkerHandlerGroup implements HandlerGroup<BJob> {
  constructor(
    private readonly b1JobHandler: B1JobHandler,
    private readonly b2JobHandler: B2JobHandler,
  ) {}

  async handle(job: BJob): Promise<void> {
    const { handler, param } = job;
    const h = this[handler];
    await h.handle.apply(h, param);
  }
}
