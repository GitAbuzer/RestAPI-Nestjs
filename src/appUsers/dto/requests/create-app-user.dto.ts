import { ApiProperty } from '@nestjs/swagger';
import { CreateContactInfoDto } from './create-contact-info.dto';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export default class CreateAppUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'You have to enter a password value!' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'You have to enter a username value!' })
  username: string;

  @ApiProperty({
    type: CreateContactInfoDto, // Define the type as an array of CreateContactInfoDto
    isArray: true,
  })
  @ValidateNested({ each: true }) // Ensure each element in the array is validated individually
  @Type(() => CreateContactInfoDto) // Specify the type of the nested DTO
  contactInfos: CreateContactInfoDto[];

  @ApiProperty({
    type: CreateRoleDto,
    isArray: true,
  })
  roles: CreateRoleDto[];
}
