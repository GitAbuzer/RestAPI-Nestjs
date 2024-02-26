import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AppUser from 'src/appUsers/entities/app-user.entity';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Team } from 'src/teams/entities/team.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<string> {
    const creator: AppUser = (
      await this.appUserRepository.find({
        where: { id: createTaskDto.creatorId },
        //relations: { roles: true }
      })
    ).at(0);
    const entity: Task = await this.tasksRepository.create(createTaskDto);
    entity.creator = creator;
    if (createTaskDto.contributorId) {
      const contributor: AppUser = (
        await this.appUserRepository.find({
          where: { id: createTaskDto.contributorId },
        })
      ).at(0);
      entity.worker = contributor;
    }
    if (createTaskDto.teamId) {
      const team: Team = (
        await this.teamsRepository.find({
          where: { id: createTaskDto.teamId },
          relations: {
            tasks: true,
          },
        })
      ).at(0);
      team.tasks.push(entity);
    }

    const result: Task = await this.tasksRepository.save(entity);
    return `${result.id} is created successfully!`;
  }

  async findAll() {
    const tasks: Task[] = await this.tasksRepository.find();
    return tasks.length > 0 ? tasks : `There is no Task`;
  }

  async findOne(id: number): Promise<Task | string> {
    const task: Task = await this.tasksRepository.findOneBy({ id });
    return task ? task : `Task not found with ${id}!`;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const result = await this.tasksRepository.update(id, updateTaskDto);
    return result.affected > 0
      ? `update operation is done successfully with ${id} `
      : `something went wrong while update ${id} Task`;
  }

  async remove(id: number) {
    await this.tasksRepository.delete(id);
    return `This action removes a #${id} Task;`;
  }

  async addTaskOnAnAppUser(
    appUserId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<object | string> {
    const appUser: AppUser = (
      await this.appUserRepository.find({
        where: {
          id: appUserId,
          isActive: true,
        },
      })
    ).at(0);
    const result: Task = await this.tasksRepository.save(createTaskDto);

    if (appUser === null) return `${appUserId} could not found!`;

    result.worker = appUser;

    appUser.tasks.push(result);
    await this.appUserRepository.save(appUser);

    return {
      message: `Task is created succesfully with ${result.id} id!`,
      taskId: result.id,
    };
  }

  async addTaskOnATeam(
    teamId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<object | string> {
    const team: Team = (
      await this.teamsRepository.find({
        where: {
          id: teamId,
          isActive: true,
        },
      })
    ).at(0);
    const result: Task = await this.tasksRepository.save(createTaskDto);

    if (team === null) return `${teamId} could not found!`;

    team.tasks.push(result);
    await this.teamsRepository.save(team);

    return {
      message: `Task is created succesfully with ${result.id} id!`,
      taskId: result.id,
    };
  }
}
