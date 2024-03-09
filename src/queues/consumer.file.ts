import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger: Logger = new Logger(ConsumerService.name);
  private readonly emailQueue: string = 'emailQueue';
  private readonly maxRetries: number = 3; // Maximum number of retries
  private readonly retryDelay: number = 5000; // Retry delay in milliseconds

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
            let retryCount = 0;
            this.logger.debug(message.properties.headers);
            if (
              message.properties.headers &&
              message.properties.headers['x-retry-count']
            ) {
              retryCount = parseInt(
                message.properties.headers['x-retry-count'],
              );
            }

            try {
              const result = await this.emailService.sendEmail(content);
              this.logger.log('Mail sending result:', result);
              channel.ack(message);
            } catch (error) {
              this.logger.error('Error sending email:', error);

              if (retryCount < this.maxRetries) {
                const updatedHeaders = {
                  ...message.properties.headers,
                  'x-retry-count': retryCount + 1,
                };

                setTimeout(() => {
                  // Re-publish the message with updated headers
                  channel.publish(
                    '',
                    this.emailQueue,
                    Buffer.from(message.content),
                    { headers: updatedHeaders },
                  );
                  channel.ack(message);
                }, this.retryDelay);
              } else {
                this.logger.error('Max retries exceeded, message discarded.');
                channel.reject(message, false); // Requeue message
              }
            }
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
