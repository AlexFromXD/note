import { DynamicModule, Global, Module } from '@nestjs/common';
import { Define } from '../define';
import { RabbitmqConfig } from './rabbitmq.config';
import { RabbitmqService } from './rabbitmq.service';
import { ChannelManager } from './session-manager/channel.manager';
import { ConnectionManager } from './session-manager/connection.manager';

@Global()
@Module({
  providers: [ChannelManager, ConnectionManager, RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {
  static forRoot(queueConfig: RabbitmqConfig[]): DynamicModule {
    return {
      module: RabbitmqModule,
      providers: [
        {
          provide: Define.providerToken.queueConfig,
          useValue: queueConfig,
        },
      ],
    };
  }
}
