import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsEmailOrPhone } from '../validators/create-contact-info.validator';

export class CreateContactInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  isPrimary: boolean;

  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsEmailOrPhone()
  info: string;
}
