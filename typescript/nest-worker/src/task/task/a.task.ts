import { JobOptions } from '../../worker/worker.schema';
import { A1Job } from '../job/a1.job';
import { A2Job } from '../job/a2.job';
import { GeneralPubTask } from '../task.define';

export class ATask extends GeneralPubTask<AJob> {}

export type AJob = (A1Job | A2Job) & JobOptions;
