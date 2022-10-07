import { Injectable } from '@nestjs/common';
import { A1Job } from '../../../task/job/a1.job';
import { JobHandler } from '../../../worker/worker.schema';

@Injectable()
export class A1JobHandler implements JobHandler {
  handle(...param: A1Job['param']) {
    console.log(param);
  }
}
