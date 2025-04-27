export type StateMeta = {
  readonly name: string
}

export type State<C> = {
  onEnter?: (meta: StateMeta, context: C) => unknown | Promise<unknown>
  onExit?: (meta: StateMeta, context: C) => unknown | Promise<unknown>
  /**
   * @param context Be cautious: the context is design to be modifiable in purpose.
   */
  action?: (context: C, meta: StateMeta) => unknown | Promise<unknown>
}

export type PathRule<StateName extends string, C> =
  | { if: (context: C) => boolean | Promise<boolean>; to: StateName }
  | { to: StateName }

export type FSMConfig<C, T extends Record<string, State<C>>> = {
  context: C
  states: T
  paths: {
    [K in keyof T & string]?:
      | PathRule<keyof T & string, C>
      | PathRule<keyof T & string, C>[]
  }
}

/**
 * @description Flow-driven FSM with strongly typed context.
 */
export class FSMachine<C, T extends Record<string, State<C>>> {
  private currentState!: keyof T & string
  private context: C
  private states: T
  private paths: FSMConfig<C, T>['paths']

  constructor(config: FSMConfig<C, T>) {
    this.context = config.context
    this.states = config.states
    this.paths = config.paths
  }

  async start(initialState: keyof T & string) {
    this.currentState = initialState
    await this.next()
  }

  getContext() {
    return this.context
  }

  private async next(): Promise<void> {
    const state = this.states[this.currentState]
    const path = this.paths[this.currentState]

    if (!state) {
      throw new Error(`State "${this.currentState}" not found.`)
    }

    const meta = { name: this.currentState }
    const context = this.context

    await state.onEnter?.(meta, context)
    await state.action?.(context, meta)
    await state.onExit?.(meta, context)

    let nextState: (keyof T & string) | undefined

    if (Array.isArray(path)) {
      for (const p of path) {
        const result = await Promise.resolve(p.if?.(context) ?? true)
        if (result) {
          nextState = p.to
          break
        }
      }
    } else if (path && 'to' in path) {
      nextState = path.to
    }

    if (nextState) {
      this.currentState = nextState
      await this.next()
    }
  }
}
