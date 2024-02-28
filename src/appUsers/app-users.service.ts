import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateAppUserDto from './dto/requests/create-app-user.dto';
import AppUser from './entities/app-user.entity';
import { UpdateAppUserDto } from './dto/requests/update-app-user.dto';
import { ContactInfo } from './entities/contact-info.entity';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/requests/create-role.dto';
import { CreateContactInfoDto } from './dto/requests/create-contact-info.dto';
import { createHash } from 'crypto';

@Injectable()
export class AppUsersService {
  constructor(
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
    @InjectRepository(ContactInfo)
    private readonly contactInfoRepository: Repository<ContactInfo>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    /*  @InjectRepository(Team)
    private readonly teamRepository: Repository<Team> */
  ) {}

  async create(createAppUserDto: CreateAppUserDto): Promise<object | any> {
    const isExist: boolean = await this.appUserRepository.exists({
      where: { username: createAppUserDto.username },
    });
    const sha256Password = createHash('sha256')
      .update(createAppUserDto.password)
      .digest('base64');
    createAppUserDto.password = sha256Password;
    if (isExist) {
      return {
        message: `${createAppUserDto.username} has already exists!`,
        success: false,
      };
    }

    const result: AppUser = await this.appUserRepository.save(createAppUserDto);
    await this.addContactInfoOnUser(createAppUserDto.contactInfo, result);
    await this.addRoleOnUser(createAppUserDto.role, result);

    return {
      message: `${result.username} is created successfully!`,
      appUserId: result.id,
      success: true,
    };
  }

  async findAll(): Promise<AppUser[] | string> {
    const appUsers: AppUser[] = await this.appUserRepository.find({
      relations: {
        profile: true,
      },
    });
    return appUsers.length > 0 ? appUsers : `There is no Address!`;
  }

  async findOne(id: number) {
    const appUser: AppUser = (
      await this.appUserRepository.find({
        where: {
          id: id,
        },
        relations: {
          profile: true,
        },
      })
    ).at(0);
    return appUser ? appUser : `AppUser not found with ${id}!`;
  }

  async addNewContactInfoOnAppUser(
    id: number,
    createContactInfoDto: CreateContactInfoDto,
  ) {
    const createContactInfoDtos: CreateContactInfoDto[] = [];
    createContactInfoDtos.push(createContactInfoDto);
    const appUser: AppUser = await this.appUserRepository.findOneBy({ id });
    return await this.addContactInfoOnUser(createContactInfoDtos, appUser);
  }

  //function successUpdateMessage: string = (id) : Promise<string> => `${id} updated!`;

  async update(id: number, updateAppUserDto: UpdateAppUserDto) {
    const sha256Password = createHash('sha256')
      .update(updateAppUserDto.password)
      .digest('base64');
    updateAppUserDto.password = sha256Password;
    const result = await this.appUserRepository.update(id, updateAppUserDto);
    return result.affected > 0
      ? `update operation is done successfully with ${id} `
      : `something went wrong while update ${id} Address!`;
  }

  async remove(id: number) {
    await this.appUserRepository.delete(id);
    return `This action removes a #${id} Address`;
  }

  async addContactInfoOnUser(
    contactInfos: CreateContactInfoDto[],
    result: AppUser,
  ) {
    contactInfos.forEach(async (e) => {
      const contactInfo: ContactInfo = new ContactInfo();
      const appUser: AppUser = result;
      Object.assign(contactInfo, e);
      contactInfo.appUser = appUser;
      await this.contactInfoRepository.save(contactInfo);
    });
    return `Contact infos added successfully!`;
  }
  async addRoleOnUser(roles: CreateRoleDto[], result: AppUser) {
    roles.forEach(async (e) => {
      const role: Role = new Role();
      const appUser: AppUser = result;
      Object.assign(role, e);
      role.appUser = appUser;
      await this.roleRepository.save(role);
    });
  }
}
