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
} from '@nestjs/common';
import { AppUsersService } from './app-users.service';
import CreateAppUserDto from './dto/requests/create-app-user.dto';
import AppUser from './entities/app-user.entity';
import { UpdateAppUserDto } from './dto/requests/update-app-user.dto';
import { CreateContactInfoDto } from './dto/requests/create-contact-info.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RoleType } from './entities/role.entity';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('appUsers')
export class AppUsersController {
  constructor(private readonly appUsersService: AppUsersService) {}

  @Post()
  async create(@Body() createAppUserDto: CreateAppUserDto) {
    return await this.appUsersService.create(createAppUserDto);
  }

  @HasRoles(RoleType.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    return await this.appUsersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result: AppUser | string = await this.appUsersService.findOne(+id);
    const status: HttpStatus =
      typeof result == 'string' ? HttpStatus.NOT_FOUND : HttpStatus.OK;
    return {
      status: status,
      response: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppUserDto: UpdateAppUserDto,
  ) {
    const result: string = await this.appUsersService.update(
      +id,
      updateAppUserDto,
    );
    const status: HttpStatus = result.includes('wrong')
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;
    return `${status} ${result}`;
  }

  @Post('addContactInfo/:id')
  async addContactInfo(
    @Param('id') id: string,
    @Body() createContactInfoDto: CreateContactInfoDto,
  ) {
    const result: string =
      await this.appUsersService.addNewContactInfoOnAppUser(
        +id,
        createContactInfoDto,
      );
    const status: HttpStatus = result.includes('wrong')
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;
    return `${status} ${result}`;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.appUsersService.remove(+id);
  }
}
