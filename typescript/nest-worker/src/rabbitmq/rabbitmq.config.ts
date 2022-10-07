import { Options } from 'amqplib';
import { config } from '../config';

export type RabbitmqConfig = {
  readonly name: string;
  readonly prefetch: number;
  readonly delayExchangeRouteKey: string;
  readonly consumeOptions?: Options.Consume;
  readonly publishOptions?: Options.Publish;
  readonly assertOptions?: Options.AssertQueue;
};

/**
 * @see {@link https://github.com/rabbitmq/rabbitmq-delayed-message-exchange}
 */
export const workerDelayExchange = {
  name: `worker-delay:${config.nodeEnv}`,
  type: 'x-delayed-message',
  assertOptions: {
    arguments: {
      // performance of fanout if better than direct because it doesn't handle `RouteKey`,
      // but you must to bind exchange and queue.
      'x-delayed-type': 'direct',
    },
  } as Options.AssertExchange,
} as const;
