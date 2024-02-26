import { ApiProperty } from "@nestjs/swagger"

export class CreateProfileDto {
  @ApiProperty()
    appUserId: number
  
  @ApiProperty()
    gender: string
    
  @ApiProperty()
    photo: string  
  
  @ApiProperty( {
      default: true
    } )
      isActive: boolean

}