import { Injectable } from '@nestjs/common';
import { AJob } from '../task/task/a.task';
import { HandlerGroup } from '../worker/worker.schema';
import { A1JobHandler } from './handler/a/a1.handler';
import { A2JobHandler } from './handler/a/a2.handler';

@Injectable()
export class AWorkerHandlerGroup implements HandlerGroup<AJob> {
  constructor(
    private readonly a1JobHandler: A1JobHandler,
    private readonly a2JobHandler: A2JobHandler,
  ) {}

  async handle(job: AJob): Promise<void> {
    const { handler, param } = job;
    const h = this[handler];
    await h.handle.apply(h, param);
  }
}
