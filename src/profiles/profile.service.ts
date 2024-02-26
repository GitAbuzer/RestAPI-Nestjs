import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AppUser from 'src/appUsers/entities/app-user.entity';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<string> {
    const profile: Profile = new Profile();
    const appUser: AppUser = (
      await this.appUserRepository.find({
        where: {
          id: createProfileDto.appUserId,
        },
        relations: {
          profile: true,
        },
      })
    ).at(0);
    Object.assign(profile, createProfileDto);
    if (appUser.profile !== null) return `${appUser.id} already has a profile!`;
    const result: Profile = await this.profilesRepository.save(profile);
    appUser.profile = result;
    await this.appUserRepository.save(appUser);
    return `${result.id} is created successfully!`;
  }

  async findAll() {
    const profiles: Profile[] = await this.profilesRepository.find();
    return profiles.length > 0 ? profiles : `There is no Profile!`;
  }

  async findOne(id: number) {
    const profile = await this.profilesRepository.findOneBy({ id });
    return profile ? profile : `Profile not found with ${id}!`;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const result = await this.profilesRepository.update(id, updateProfileDto);
    return result.affected > 0
      ? `update operation is done successfully with ${id} `
      : `something went wrong while update ${id} Profile!`;
  }

  async remove(id: number) {
    await this.profilesRepository.delete(id);
    return `This action removes a #${id} Profile`;
  }
}
