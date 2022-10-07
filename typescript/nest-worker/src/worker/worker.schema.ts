/**
 * @description all handler must implement this interface
 */
export interface JobHandler {
  handle(...args: unknown[]): Promise<unknown> | unknown;
}

export interface HandlerGroup<T> {
  handle(job: T): Promise<void>;
}

export type JobOptions = {
  retry?: {
    /**
     * @description if error: worker will retry until job.retry.limit <= 0
     */
    limit: number;
    /**
     * @description delay interval between each retry
     */
    delay?: number;
  };

  /**
   * @description execute the following job or not while exception occurring
   */
  ignoreException?: boolean;
};
