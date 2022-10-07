import { Injectable, Logger } from '@nestjs/common';
import { Channel } from 'amqplib';
import { ChannelManager, Daemon } from './session-manager/channel.manager';

@Injectable()
export class RabbitmqService {
  constructor(private readonly _channelManager: ChannelManager) {}

  static readonly logger = new Logger(RabbitmqService.name);

  hc() {
    return this._channelManager.hc();
  }

  /**
   * @description anything you want to execute after each time reconnect to server
   */
  setDaemon(daemon: Daemon) {
    this._channelManager.setDaemon(daemon);
  }

  getChannel(): Promise<Channel> {
    return this._channelManager.getChannel();
  }
}
