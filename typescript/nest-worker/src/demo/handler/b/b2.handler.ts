import { Injectable } from '@nestjs/common';
import { B2Job } from '../../../task/job/b2.job';
import { JobHandler } from '../../../worker/worker.schema';

@Injectable()
export class B2JobHandler implements JobHandler {
  handle(...param: B2Job['param']) {
    console.log(param);
  }
}
