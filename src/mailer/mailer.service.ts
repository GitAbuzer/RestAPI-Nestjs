import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailInterface } from './mail.interface';
import Mail from 'nodemailer/lib/mailer';
@Injectable()
export class MailerService {
  private readonly logger: Logger = new Logger(MailerService.name);
  mailTransport() {
    const transporter: any = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
    return transporter;
  }

  createTemplate(html: string, replacements: Record<string, string>) {
    return html.replace(/%(\w*)%/g, (m, key) => {
      return replacements.hasOwnProperty(key) ? replacements[key] : '';
    });
  }

  async sendEmail(dto: SendEmailInterface) {
    const { from, recipients, subject } = dto;
    if (!dto || !dto.recipients || dto.recipients.length === 0) {
      throw new Error('No recipients defined');
    }
    const html: string = dto.placeHolderReplacements
      ? this.createTemplate(dto.html, dto.placeHolderReplacements)
      : dto.html;
    const transport: any = this.mailTransport();
    const options: Mail.Options = {
      from: from ?? {
        name: process.env.APP_NAME,
        address: process.env.DEFAULT_MAIL_SENDER,
      },
      to: recipients,
      subject,
      html,
    };
    try {
      const result: any = await transport.sendMail(options);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
