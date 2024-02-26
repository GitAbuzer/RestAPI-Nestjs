import { ApiProperty } from "@nestjs/swagger";

enum RoleType {
  Admin = 'admin',
  Manager = 'manager',
  Engineer = 'engineer',
  Formen = 'formen',
  Worker = 'worker',
  User = 'user'
}

export class CreateRoleDto {
  
  @ApiProperty({
    enum: RoleType,
    isArray: false,
    example: "admin" 
  })
    title: RoleType

  @ApiProperty()
    description: string
}

