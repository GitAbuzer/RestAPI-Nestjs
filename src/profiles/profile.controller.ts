import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ProfilesService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from 'src/profiles/entities/profile.entity';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto) {
    return await this.profilesService.create(createProfileDto);
  }

  @Get()
  async findAll() {
    return await this.profilesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result: Profile | string = await this.profilesService.findOne(+id);
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
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const result: string = await this.profilesService.update(
      +id,
      updateProfileDto,
    );
    const status: HttpStatus = result.includes('wrong')
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;
    return `${status} ${result}`;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.profilesService.remove(+id);
  }
}
