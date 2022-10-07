import { config } from '../../config';
import { RabbitmqConfig } from '../rabbitmq.config';

export const aWorkerQueueConfig: RabbitmqConfig = {
  name: `a-worker:${config.nodeEnv}`,
  prefetch: 1,
  delayExchangeRouteKey: 'to_a_worker',
  publishOptions: {
    persistent: true,
  },
  assertOptions: {
    durable: true,
    arguments: {
      'x-queue-type': 'quorum',
    },
  },
  consumeOptions: {
    noAck: false,
  },
} as const;
