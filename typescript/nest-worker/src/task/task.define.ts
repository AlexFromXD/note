import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

/**
 * @description one task <-> one worker
 */
export interface PubTask<T> {
  readonly jobList: T[][];

  name?: string;

  add(job: T | T[]): this;
}

/**
 * @description a basic task should look like this
 */
export abstract class GeneralPubTask<T> implements PubTask<T> {
  readonly jobList: T[][] = [];

  name?: string;

  constructor(name?: string) {
    if (name) {
      this.name = name;
    }
  }

  add(job: T | T[]): this {
    this.jobList.push(Array.isArray(job) ? job : [job]);
    return this;
  }
}

class Job {
  @IsString()
  handler!: string;

  @IsArray()
  param!: unknown[];
}

/**
 * @description a deserialized object for consumer to execute
 */
export class SubTask<T = unknown> {
  @IsString()
  name!: string;

  @IsArray({ each: true })
  @Type(() => Job)
  jobList!: T[][];
}
