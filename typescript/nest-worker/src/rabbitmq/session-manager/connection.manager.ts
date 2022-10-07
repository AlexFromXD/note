import { Injectable } from '@nestjs/common';
import { connect, Connection } from 'amqplib';
import { config } from '../../config';
import { RabbitmqService } from '../rabbitmq.service';

@Injectable()
export class ConnectionManager {
  private _connection?: Connection;
  private _lock = false;

  private async _init() {
    if (this._lock) {
      return;
    }

    this._lock = true;

    await connect(config.rabbitmqUrl)
      .then((connection) => {
        this._register(connection);
        RabbitmqService.logger.log('connection is ready');
      })
      .catch(console.error);

    this._lock = false;
  }

  private _register(connection: Connection) {
    this._connection = connection
      .once('error', async (err) => {
        console.error(err);
        await this._connection?.close();
      })
      .once('close', () => {
        this._connection = undefined;
      });
  }

  async getConnection() {
    if (!this._connection) {
      await this._init();
    }

    return this._connection;
  }
}
