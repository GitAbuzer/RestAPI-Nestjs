import { ApiPropertyOptional } from '@nestjs/swagger';

export class TaskQueryParamsDto {
  @ApiPropertyOptional()
  teamId?: number;
  @ApiPropertyOptional()
  workerId?: number;
}
