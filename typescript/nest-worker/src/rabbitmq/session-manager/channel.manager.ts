import { Inject, Injectable } from '@nestjs/common';
import { Channel } from 'amqplib';
import delay from 'delay';
import { Define } from '../../define';
import { RabbitmqConfig, workerDelayExchange } from '../rabbitmq.config';
import { RabbitmqService } from '../rabbitmq.service';
import { ConnectionManager } from './connection.manager';

/**
 * @description channel is a virtual connection in RabbitMQ
 * @see {@link https://www.rabbitmq.com/channels.html#basics}
 */
@Injectable()
export class ChannelManager {
  private _daemons: Daemon[] = [];
  private _channel?: Channel;
  /**
   * @description avoid to make redundant request
   */
  private _lock = false;
  private _hc = true;

  constructor(
    @Inject(Define.providerToken.queueConfig)
    private readonly _queueConfig: RabbitmqConfig[],
    private readonly _connectionManager: ConnectionManager,
  ) {}

  private async _init(retry = 0) {
    if (this._lock) {
      return;
    }

    this._lock = true;
    this._hc = false;

    const connection = await this._connectionManager.getConnection();
    if (connection) {
      const channel = await connection.createChannel().catch(console.error);
      if (channel) {
        const success = await this._register(channel).catch(console.error);
        if (success) {
          this._hc = true;
          this._lock = false;
          RabbitmqService.logger.log('channel is ready');
          return;
        }
      }
    }

    if (retry) {
      const duration = retry * 1000;
      RabbitmqService.logger.error(`recreate channel after ${retry} seconds`);
      await delay(duration);
    }

    this._lock = false;
    await this._init(++retry);
  }

  private async _register(channel: Channel) {
    this._channel = channel
      .once('error', async (err) => {
        console.error(err);
        await this._channel?.close();
      })
      .once('close', async () => {
        this._hc = false;
        this._channel = undefined;
        RabbitmqService.logger.error('channel closed');
        await this._init();
      });

    await Promise.all([
      ...this._queueConfig.map((config) =>
        channel.assertQueue(config.name, config.assertOptions),
      ),
      channel.assertExchange(
        workerDelayExchange.name,
        workerDelayExchange.type,
        workerDelayExchange.assertOptions,
      ),
    ]);

    await Promise.all(
      this._queueConfig.map((config) =>
        channel.bindQueue(
          config.name,
          workerDelayExchange.name,
          config.delayExchangeRouteKey,
        ),
      ),
    );

    for (const service of this._daemons) {
      service();
    }

    return true;
  }

  async getChannel() {
    if (!this._channel) {
      await this._init();
    }

    return this._channel as Channel;
  }

  hc() {
    return this._hc;
  }

  setDaemon(daemon: Daemon) {
    this._daemons.push(daemon);
  }
}

/** @description anything you want to execute after queue reconnect to server */
export type Daemon = (...args: unknown[]) => unknown;
