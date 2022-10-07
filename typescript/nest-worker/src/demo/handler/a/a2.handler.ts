import { Injectable } from '@nestjs/common';
import { A2Job } from '../../../task/job/a2.job';
import { JobHandler } from '../../../worker/worker.schema';

@Injectable()
export class A2JobHandler implements JobHandler {
  handle(...param: A2Job['param']) {
    console.log(param);
  }
}
