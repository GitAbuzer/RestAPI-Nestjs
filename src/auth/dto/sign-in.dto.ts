import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'You have to enter a username value!' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'You have to enter a password value!' })
  password: string;
}
