import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  addressOne: string;

  @ApiProperty()
  addressTwo: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  county: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  appUserId: number;
}
