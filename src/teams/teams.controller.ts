import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Response } from 'express';
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @Res() response: Response,
  ) {
    response.status(HttpStatus.CREATED).send({
      result: await this.teamsService.create(createTeamDto),
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Res() response: Response) {
    response.status(HttpStatus.OK).send({
      response: await this.teamsService.findAll(),
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response: Response) {
    const result: Team | string = await this.teamsService.findOne(id);
    const status: HttpStatus =
      typeof result == 'string' ? HttpStatus.NOT_FOUND : HttpStatus.OK;
    response.status(status).send({ response: result });
  }

  @Patch(':id/update')
  async update(
    @Param('id') id: number,
    @Body() updateTeamDto: UpdateTeamDto,
    @Res() response: Response,
  ) {
    const result: string = await this.teamsService.update(id, updateTeamDto);
    const status: HttpStatus = result.includes('wrong')
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;
    response.status(status).send({ response: result });
  }

  @Patch(':id/addMembers')
  async addMembers(
    @Param('id') id: number,
    @Body() selectedAppUsers: number[],
    @Res() response: Response,
  ) {
    const result: Team = await this.teamsService.addNewMembersInTeam(
      id,
      selectedAppUsers,
    );
    response.status(HttpStatus.CREATED).send({ response: result });
  }

  @Delete(':id/remove')
  async remove(@Param('id') id: number, @Res() response: Response) {
    response.status(HttpStatus.OK).send({
      result: await this.teamsService.remove(id),
    });
  }
}
