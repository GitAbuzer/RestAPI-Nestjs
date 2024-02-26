import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty({
    default: true,
  })
  isActive: boolean;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  creatorId: number;

  @ApiProperty()
  teamId: number;

  @ApiProperty()
  contributorId: number;
}
