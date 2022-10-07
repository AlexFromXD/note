import { PubTask, SubTask } from './task.define'

export interface TaskTranslator {
  /**
   * @description
   *  - set name
   *  - transformer
   *  - toBuffer()
   */
  serialize(task: PubTask<unknown>): Buffer

  /**
   * @description
   *  - validate
   *  - toJson()
   */
  deserialize(taskMessage: string): Promise<SubTask>
}
