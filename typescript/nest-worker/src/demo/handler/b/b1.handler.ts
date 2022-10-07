import { Injectable } from '@nestjs/common';
import { B1Job } from '../../../task/job/b1.job';
import { JobHandler } from '../../../worker/worker.schema';

@Injectable()
export class B1JobHandler implements JobHandler {
  handle(...param: B1Job['param']) {
    console.log(param);
  }
}
