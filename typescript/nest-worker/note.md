# About

在 nestjs 框架底下做一個 `WorkerModule` 用來實現 event driven。這邊用 RabbitMQ，但也可以換成任何一種 queue。

# Feature

- graceful shutdown
- sequential or parallel execution
- delay message
- error retry
- lock mechanism
- static type constrain both producer & consumer

# Definition

## Job

> 對應到一個 handler

```ts
{
  /**
   * @description 指定這個 job 要由哪個 `handler` 來處理
   */
  handler: string
  /**
   * @description 處理這個 job 需要的參數，會傳給 `handler`
   */
  param: any[]
}
```

## Task

> 對應到一個 handler group (worker)

```ts
/**
 * @description 用 2D-matrix 可以實現 sequential / parallel 兩種模式
 */
type Task = Job[][];
```

## Handler

```ts
/**
 * @description 跟 Job oneToOne，handle 參數定義在 Job['param']
 */
export interface JobHandler {
  handle(...args: unknown[]): Promise<unknown>;
}
```

## HandlerGroup

```ts
/**
 * @description handler injection 的集合體，讓 WorkerModule 以 dynamic 的形式決定要跑哪一組 handler
 */
export interface HandlerGroup<T> {
  handle(job: T): Promise<void>;
}

@Injectable()
export class ExampleHandlerGroup implements HandlerGroup<ExampleJob> {
  constructor(
    private readonly aJobHandler: AJobHandler,
    private readonly bJobHandler: bJobHandler,
  ) {}

  async handle(job: ExampleJob): Promise<void> {
    const { handler, param } = job;
    const h = this[handler];
    await h.handle.apply(h, param);
  }
}
```

# Demo

```sh
$ docker-compose up

$ npm run start:dev
```
