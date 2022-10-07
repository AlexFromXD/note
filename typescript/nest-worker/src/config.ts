import { IsInt, IsString, validateSync } from 'class-validator';
import { Command } from 'commander';

const opts = new Command().allowUnknownOption().parse(process.argv).opts();

class Env {
  constructor(env: typeof process.env, opts: unknown) {
    Object.assign(this, env);
    Object.assign(this, opts);

    this.prefetch = Number(env.PREFETCH) || 1;
    this.nodeEnv = env.NODE_ENV as ENV;
    this.redisUrl = env.REDIS_URL as string;
    this.rabbitmqUrl = env.RABBITMQ_URL as string;
    this.hcDomainSocketPath = env.HC_DOMAIN_SOCKET_PATH as string;
  }

  @IsString()
  readonly nodeEnv: ENV;

  @IsInt()
  readonly prefetch: number;

  @IsString()
  readonly rabbitmqUrl: string;

  @IsString()
  readonly redisUrl: string;

  @IsString()
  readonly hcDomainSocketPath: string;
}

/**
 * @description this object is considered to be a shim which supports runtime validation and stub for testing
 */
export const config = new Env(process.env, opts);

validateSync(config);

type ENV = 'test' | 'dev' | 'staging' | 'production';
