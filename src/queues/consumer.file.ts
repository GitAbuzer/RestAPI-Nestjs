import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger: Logger = new Logger(ConsumerService.name);
  private readonly emailQueue: string = 'emailQueue';
  constructor(private emailService: MailerService) {
    const connection = amqp.connect(['amqp://rabbitmq']);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.emailQueue, { durable: true });
        await channel.consume(this.emailQueue, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());

            const result = await this.emailService.sendEmail(content);
            this.logger.log('Mail sending result: ', result);
            channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
