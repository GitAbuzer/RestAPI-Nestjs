import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import AppUser from 'src/appUsers/entities/app-user.entity';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [TypeOrmModule.forFeature([Team, AppUser])],
})
export class TeamsModule {}
