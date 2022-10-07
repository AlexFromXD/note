import { Injectable } from '@nestjs/common'
import { GeneralTranslator } from './translator/general.translator'

@Injectable()
export class TaskService {
  constructor(readonly generalTranslator: GeneralTranslator) {}
}
