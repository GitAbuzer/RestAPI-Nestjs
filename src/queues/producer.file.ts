import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  private readonly logger: Logger = new Logger(ProducerService.name);
  constructor() {
    const connection = amqp.connect(['amqp://rabbitmq']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('emailQueue', { durable: true });
      },
    });
  }

  async addToEmailQueue(mail: any) {
    try {
      await this.channelWrapper.sendToQueue(
        'emailQueue',
        Buffer.from(JSON.stringify(mail)),
        {
          persistent: true,
        },
      );
      this.logger.log('Mail is Sent To Queue...');
    } catch (error) {
      throw new HttpException(
        'Error adding mail to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
