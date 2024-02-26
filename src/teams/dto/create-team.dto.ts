import { ApiProperty } from "@nestjs/swagger";

export class CreateTeamDto {

  @ApiProperty()
    name: string

  @ApiProperty()
    description: string
  
  @ApiProperty()
    selectedAppUsers: number[]
}