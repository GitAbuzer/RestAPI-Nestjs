import { Body, Controller, Post, Query } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailInterface } from './mail.interface';
import { ApiProperty } from '@nestjs/swagger';

export class EmailBody {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'string'
    }
  })
  replacements: Record<string, string>;
  @ApiProperty()
  address: string;
  @ApiProperty()
  name: string;
}

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}



  @Post('send')
  async sendEmail(@Body() body: EmailBody) {
    const dto: SendEmailInterface = {
      //from: { name: 'Lucy', address: 'lucy1-1-1@outlook.com' },
      recipients: [{ name: body.name, address: body.address }],
      subject: 'Welcome to TaskManager App',
      html: '<p>Hi %name%, welcome to TaskManager App you can see docs on <a href="http://localhost:3000/api">here</a></p>',
      placeHolderReplacements: body.replacements,
    };
    return this.mailerService.sendEmail(dto);
  }
}
