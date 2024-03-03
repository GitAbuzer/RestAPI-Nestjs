import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/addresses/entities/address.entity';
import AppUser from 'src/appUsers/entities/app-user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Role } from './entities/role.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Team } from 'src/teams/entities/team.entity';
import { AppUsersController } from './app-users.controller';
import { AppUsersService } from './app-users.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [AppUsersController],
  providers: [AppUsersService, MailerService],
  imports: [
    TypeOrmModule.forFeature([
      AppUser,
      Address,
      Profile,
      Role,
      ContactInfo,
      Task,
      Team,
    ]),
  ],
})
export class AppUsersModule {}
