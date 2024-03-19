import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ProfilesService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Response } from 'express';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Res() response: Response,
  ) {
    response.status(HttpStatus.CREATED).send({
      result: await this.profilesService.create(createProfileDto),
    });
  }

  @Get()
  async findAll(@Res() response: Response) {
    response.status(HttpStatus.OK).send({
      response: await this.profilesService.findAll(),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const result: Profile | string = await this.profilesService.findOne(+id);
    const status: HttpStatus =
      typeof result == 'string' ? HttpStatus.NOT_FOUND : HttpStatus.OK;
    response.status(status).send({ response: status });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() response: Response,
  ) {
    const result: string = await this.profilesService.update(
      +id,
      updateProfileDto,
    );
    const status: HttpStatus = result.includes('wrong')
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;
    response.status(status).send({ response: status });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    response.status(HttpStatus.OK).send({
      result: await this.profilesService.remove(+id)
    });
  }
}
