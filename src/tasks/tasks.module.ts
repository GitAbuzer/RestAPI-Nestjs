import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppUser from 'src/appUsers/entities/app-user.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { Team } from 'src/teams/entities/team.entity';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([
    Task, 
    AppUser,
    Team
  ])]
})
export class TasksModule {}
