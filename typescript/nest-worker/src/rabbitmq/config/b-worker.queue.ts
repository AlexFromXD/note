import { config } from '../../config';
import { RabbitmqConfig } from '../rabbitmq.config';

export const bWorkerQueueConfig: RabbitmqConfig = {
  name: `b-worker:${config.nodeEnv}`,
  prefetch: 1,
  delayExchangeRouteKey: 'to_b_worker',
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
