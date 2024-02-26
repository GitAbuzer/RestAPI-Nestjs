import { ApiProperty } from '@nestjs/swagger';

export class CreateContactInfoDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  title: string;

  @ApiProperty()
  info: string;
}
