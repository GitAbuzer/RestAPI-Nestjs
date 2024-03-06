import { Address } from 'nodemailer/lib/mailer';

export type SendEmailInterface = {
  from?: string | Address;
  recipients: Address[];
  subject: string;
  html: string;
  placeHolderReplacements?: Record<string, string>;
};
