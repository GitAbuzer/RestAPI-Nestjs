import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.file';
import { ProducerService } from './producer.file';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  providers: [ProducerService, ConsumerService, MailerService],
  exports: [ProducerService],
})
export class QueuesModule {}
