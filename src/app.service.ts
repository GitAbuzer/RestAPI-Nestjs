import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { Injectable } from '@nestjs/common';

export type SendEmailDto = {
  sender?: string | Address;
  recipients: Address[];
  subject: string;
  text: string;
  html: string;
};

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    return 'Hello World! hehehello world';
  }

  async sendEmail(dto: SendEmailDto) {
    const { recipients, subject, text, html } = dto;

    const sender: string | Address = dto.sender || {
      name: process.env.APP_NAME,
      address: process.env.MAIL_SENDER,
    };
    try {
      const result: any = await this.mailerService.sendMail({
        from: sender,
        to: recipients,
        subject,
        text,
        html,
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
