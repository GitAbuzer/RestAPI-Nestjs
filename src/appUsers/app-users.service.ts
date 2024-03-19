import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { GetAppUserWithTeam } from './dto/responses/get-app-user-with-team.dto';

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
    @InjectRepository(GetAppUserWithTeam)
    private readonly customAppUserRepository: Repository<GetAppUserWithTeam>,
    @InjectRepository(AppUser)
    private readonly customAppUserRepositorySql: Repository<AppUser>,
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

    const result: AppUser = await this.appUserRepository.save(createAppUserDto);
    await this.addContactInfoOnUser(createAppUserDto.contactInfos, result);
    await this.addRoleOnUser(createAppUserDto.roles, result);
    const mailBody = await this.createWelcomeEmailBody(
      createAppUserDto.contactInfos,
      result,
    );
    await this.addWelcomeEmailOnQueue(mailBody);
    return {
      message: `${result.username} is created successfully!`,
      appUserId: `${result.id}`,
      success: true,
    };
  }
  async getTeamMemberInfo(teamMemberId: number): Promise<GetAppUserWithTeam[]> {
    const query: string = `
      SELECT * FROM get_team_member_info($1)
    `;
    const queryResult: any = await this.customAppUserRepository.query(query, [
      teamMemberId,
    ]);
    if (queryResult.length === 0)
      throw new NotFoundException(`${teamMemberId} has no team!`);
    const resultObject: GetAppUserWithTeam[] = [];

    const result: GetAppUserWithTeam[] = Object.assign(
      resultObject,
      queryResult,
    );

    return result;
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
    if (appUsers.length === 0) throw new NotFoundException();
    return appUsers;
  }

  async findOne(id: number): Promise<AppUser> {
    const appUser: AppUser = await this.appUserRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        profile: true,
      },
    });
    if (!appUser) throw new NotFoundException(`there is no user with #${id}`);
    return appUser;
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
    if (!appUser)
      throw new NotFoundException(`There is no user with #${id} to delete!`);
    appUser.isActive = false;
    this.appUserRepository.save(appUser);
    return `This action soft deleted a #${id} AppUser`;
  }

  async addContactInfoOnUser(
    contactInfos: CreateContactInfoDto[],
    result: AppUser,
  ) {
    try {
      contactInfos.forEach(async (e) => {
        const contactInfo: ContactInfo = new ContactInfo();
        const appUser: AppUser = result;
        Object.assign(contactInfo, e);
        contactInfo.appUser = appUser;
        await this.contactInfoRepository.save(contactInfo);
      });
      return `Contact infos added successfully!`;
    } catch (error) {
      Logger.warn(contactInfos);
      Logger.error(error);
      throw new InternalServerErrorException(
        `something went wrong while added contact info on ${result.username}`,
      );
    }
  }
  async selectAllWithSQLInjection(username: string) {
    Logger.debug(username);
    const query = await this.customAppUserRepositorySql.query(`
    SELECT password, username
      FROM public.app_user as a
      WHERE a."username" = '${username}'`);
    return query;
  }
  async addRoleOnUser(roles: CreateRoleDto[], result: AppUser) {
    try {
      roles.forEach(async (e) => {
        const role: Role = new Role();
        const appUser: AppUser = result;
        Logger.log(role.type);
        Object.assign(role, e);
        role.appUser = appUser;
        await this.roleRepository.save(role);
      });
    } catch (error) {
      Logger.warn(roles);
      Logger.error(error);
    }
  }
  async createWelcomeEmailBody(
    contactInfos: CreateContactInfoDto[],
    result: AppUser,
  ): Promise<EmailBody> {
    let userEmail: string;
    contactInfos.forEach((c) => {
      if (c.type.toLocaleLowerCase() === 'email' && c.isPrimary)
        userEmail = c.info;
    });
    const mailBody: EmailBody = {
      replacements: {
        name: `${result.firstName} ${result.lastName} aka ${result.username}`,
      },
      address: userEmail,
      name: `${result.firstName} ${result.lastName}`,
    };
    return mailBody;
  }
  async addWelcomeEmailOnQueue(body: EmailBody) {
    const dto: SendEmailInterface = {
      recipients: [{ name: body.name, address: body.address }],
      subject: 'Welcome to TaskManager App',
      html: `<p>
                Hi %name%, welcome to TaskManager App you can see docs on 
                <a href="http://localhost:3000/api">here</a>
            </p>`,
      placeHolderReplacements: body.replacements,
    };
    return await this.producerService.addToEmailQueue(dto);
  }
}
