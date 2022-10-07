import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from '../config';

@Injectable()
export class RedisService {
  readonly client: Redis;

  constructor() {
    this.client = new Redis(config.redisUrl, {
      retryStrategy(times) {
        return (times + 1) * 1000;
      },
    });
  }

  preempt(key: string, lockHowManySeconds = 2) {
    // EX seconds -- Set the specified expire time, in seconds.
    // NX -- Only set the key if it does not already exist.
    // more detail: https://redis.io/commands/set
    return this.client.set(key, 1, 'EX', lockHowManySeconds, 'NX');
  }

  hc() {
    return this.client.ping().then(Boolean).catch(console.log);
  }
}
