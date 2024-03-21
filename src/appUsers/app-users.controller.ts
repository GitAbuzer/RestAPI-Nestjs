import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  Logger,
  Res,
} from '@nestjs/common';
import { AppUsersService } from './app-users.service';
import CreateAppUserDto from './dto/requests/create-app-user.dto';
import { UpdateAppUserDto } from './dto/requests/update-app-user.dto';
import { CreateContactInfoDto } from './dto/requests/create-contact-info.dto';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RoleType } from './entities/role.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetAppUserWithTeam } from './dto/responses/get-app-user-with-team.dto';
import { Response } from 'express';
class Username {
  @ApiProperty()
  username: string;
}
@Controller('appUsers')
export class AppUsersController {
  constructor(private readonly appUsersService: AppUsersService) {}

  @Post()
  async create(
    @Body() createAppUserDto: CreateAppUserDto,
    @Res() response: Response,
  ) {
    response.status(HttpStatus.CREATED).send({
      result: await this.appUsersService.create(createAppUserDto),
    });
  }

  @HasRoles(RoleType.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Res() response: Response) {
    response
      .status(HttpStatus.OK)
      .send({ response: await this.appUsersService.findAll() });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    response.status(HttpStatus.OK).send({
      response: await this.appUsersService.findOne(+id),
    });
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':teamMemberId/teams')
  async findWithTeam(
    @Param('teamMemberId') teamMemberId: string,
    @Res() response: Response,
  ) {
    const result: GetAppUserWithTeam[] | NotFoundException =
      await this.appUsersService.getTeamMemberInfo(+teamMemberId);
    response.status(HttpStatus.OK).send({
      response: result,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppUserDto: UpdateAppUserDto,
    @Res() response: Response,
  ) {
    const result: string = await this.appUsersService.update(
      +id,
      updateAppUserDto,
    );
    const status: HttpStatus = result.includes('wrong')
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;
    response.status(status).send({ result: result });
  }

  @Post(':id/addContactInfo')
  async addContactInfo(
    @Param('id') id: string,
    @Body() createContactInfoDto: CreateContactInfoDto,
    @Res() response: Response,
  ) {
    const result: string =
      await this.appUsersService.addNewContactInfoOnAppUser(
        +id,
        createContactInfoDto,
      );
    const status: HttpStatus = result.includes('wrong')
      ? HttpStatus.INTERNAL_SERVER_ERROR
      : HttpStatus.OK;
    response.status(status).send({
      result: result,
    });
  }

  // Warning⚠️: That endpoint codded for an example of SQL Injection problem
  @Post('all')
  async GetAppUserWithUsernameSQLInjectable(@Body() username: Username) {
    Logger.warn('!!!⚠️sql injection problem⚠️!!!');
    return await this.appUsersService.selectAllWithSQLInjection(
      username.username,
    );
  }
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.appUsersService.softDelete(+id);
  }

  @HasRoles(RoleType.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Delete(':id/hardDelete')
  async remove(@Param('id') id: string) {
    return await this.appUsersService.hardDelete(+id);
  }
}
