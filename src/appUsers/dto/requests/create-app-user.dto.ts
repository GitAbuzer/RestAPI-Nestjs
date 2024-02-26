import { ApiProperty } from '@nestjs/swagger';
import { CreateContactInfoDto } from './create-contact-info.dto';
import { CreateRoleDto } from './create-role.dto';

export default class CreateAppUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;

  @ApiProperty({
    type: CreateContactInfoDto,
    isArray: true,
  })
  contactInfo: CreateContactInfoDto[];

  @ApiProperty({
    type: CreateRoleDto,
    isArray: true,
  })
  role: CreateRoleDto[];
}
