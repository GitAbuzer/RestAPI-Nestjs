import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import CreateAppUserDto from './dto/requests/create-app-user.dto';
import AppUser from './entities/app-user.entity';
import { UpdateAppUserDto } from './dto/requests/update-app-user.dto';
import { ContactInfo } from './entities/contact-info.entity';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/requests/create-role.dto';
import { CreateContactInfoDto } from './dto/requests/create-contact-info.dto';
import { createHash } from 'crypto';
import { SendEmailInterface } from 'src/mailer/mail.interface';
import { EmailBody } from 'src/mailer/mailer.controller';
import { ProducerService } from 'src/queues/producer.file';

@Injectable()
export class AppUsersService {
  constructor(
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
    @InjectRepository(ContactInfo)
    private readonly contactInfoRepository: Repository<ContactInfo>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly producerService: ProducerService,
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

    const contactInfos: string[] = [];
    createAppUserDto.contactInfos.forEach((c) => {
      contactInfos.push(c.info);
    });

    const isContactInfoExist: string[] | boolean =
      await this.isAnyContactInfoExist(contactInfos);

    if (Array.isArray(isContactInfoExist) && isContactInfoExist.length > 0) {
      return {
        message:
          isContactInfoExist.length > 1
            ? `${isContactInfoExist} are already in use!`
            : `${isContactInfoExist.at(0)} is already in use!`,
        success: false,
      };
    }

    const entity: AppUser =
      await this.appUserRepository.create(createAppUserDto);
    await this.addContactInfoOnUser(createAppUserDto.contactInfos, entity);
    await this.addRoleOnUser(createAppUserDto.roles, entity);
    let userEmail: string;
    createAppUserDto.contactInfos.forEach((c) => {
      if (c.type.toLocaleLowerCase() === 'email' && c.isPrimary)
        userEmail = c.info;
    });
    const result: AppUser = await this.appUserRepository.save(entity);
    const mailBody: EmailBody = {
      replacements: {
        name: `${result.firstName} ${result.lastName} aka ${result.username}`,
      },
      address: userEmail,
      name: `${result.firstName} ${result.lastName}`,
    };
    await this.sendWelcomeEmail(mailBody);
    return {
      message: `${result.username} is created successfully!`,
      appUserId: result.id,
      success: true,
    };
  }

  async isAnyContactInfoExist(
    contactInfos: string[],
  ): Promise<string[] | boolean> {
    const contacts: ContactInfo[] = await this.contactInfoRepository.find({
      where: {
        info: In(contactInfos),
        isActive: true,
      },
    });
    if (contacts.length > 0) {
      const existContacts: string[] = [];
      contacts.forEach((c) => existContacts.push(c.info));
      return existContacts;
    }
    return false;
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
    const appUser: AppUser = await this.appUserRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        profile: true,
      },
    });
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
      : `something went wrong while update ${id} AppUser!`;
  }

  async softDelete(id: number) {
    const appUser: AppUser = await this.appUserRepository.findOneBy({ id });
    if (!appUser) return `This action can not find a #${id} AppUser`;
    appUser.isActive = false;
    this.appUserRepository.save(appUser);
    return `This action soft deleted a #${id} AppUser`;
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
  async sendWelcomeEmail(body: EmailBody) {
    const dto: SendEmailInterface = {
      //from: { name: 'Lucy', address: 'lucy1-1-1@outlook.com' },
      recipients: [{ name: body.name, address: body.address }],
      subject: 'Welcome to TaskManager App',
      html: '<p>Hi %name%, welcome to TaskManager App you can see docs on <a href="http://localhost:3000/api">here</a></p>',
      placeHolderReplacements: body.replacements,
    };
    return await this.producerService.addToEmailQueue(dto);
  }
}
