import { Controller, Get, Post, Body, Patch, Param, Delete,  HttpStatus, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';
import { UpdateAddressDto } from 'src/addresses/dto/requests/update.address.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateResult } from 'typeorm';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    return await this.teamsService.create(createTeamDto);
  }
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    return await this.teamsService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result : Team | string = await this.teamsService.findOne(id);
    const status : HttpStatus = (typeof(result) == 'string') ? HttpStatus.NOT_FOUND : HttpStatus.OK;
    return {
      status: status,
      response: result
    };
  }

  @Patch(':id/update')
  async update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
    const result : string = await this.teamsService.update(id, updateTeamDto);
    const status : HttpStatus = ((result).includes('wrong')) ? HttpStatus.BAD_REQUEST : HttpStatus.OK; 
    return `${status} ${result}`;
  }

  @Patch(':id/addMembers')
  async addMembers(@Param('id') id: number, @Body() selectedAppUsers: number[]) {
    const result : Team = await this.teamsService.addNewMembersInTeam(id, selectedAppUsers);
    return result;
  }

  @Delete(':id/remove')
  async remove(@Param('id') id: number) {
    return await this.teamsService.remove(id);
  }
}
