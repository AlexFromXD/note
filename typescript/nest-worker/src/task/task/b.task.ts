import { JobOptions } from '../../worker/worker.schema';
import { B1Job } from '../job/b1.job';
import { B2Job } from '../job/b2.job';
import { GeneralPubTask } from '../task.define';

export class BTask extends GeneralPubTask<BJob> {}

export type BJob = (B1Job | B2Job) & JobOptions;
