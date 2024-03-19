import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
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

  async create(createTaskDto: CreateTaskDto): Promise<object> {
    const creator: AppUser = (
      await this.appUserRepository.find({
        where: { id: createTaskDto.creatorId },
        //relations: { roles: true }
      })
    ).at(0);
    if (!creator)
      throw new NotFoundException(`creator not found with ${createTaskDto.creatorId}`);

    const entity: Task = await this.tasksRepository.create(createTaskDto);
    entity.creator = creator;
    if (createTaskDto.contributorId) {
      const contributor: AppUser = (
        await this.appUserRepository.find({
          where: { id: createTaskDto.contributorId },
          relations: { tasks: true },
        })
      ).at(0);
      if (!contributor)
        throw new NotFoundException(`Contributor not found with ${createTaskDto.contributorId}`);
      entity.worker = contributor;
      contributor.tasks.push(entity);
      await this.appUserRepository.save(contributor);
    }
    const result: Task = await this.tasksRepository.save(entity);
    if (createTaskDto.teamId && !await this.tasksRepository.exists({ 
      where: {id: createTaskDto.teamId }, 
    })) 
      throw new NotFoundException(`There is no team with ${createTaskDto.teamId}`);
    else 
      this.addTaskOnATeam(result.id, createTaskDto.teamId);
    return {
      id: result.id,
      createdDate: result.createdDate,
      title: result.title,
    };
  }

  async findByWorkerId(workerId: number): Promise<Task[] | NotFoundException> {
    try {
      const worker: AppUser = await this.appUserRepository.findOneOrFail({
        where: { id: workerId },
        relations: { tasks: true },
      });
      return (!worker.tasks.length) ?
        new NotFoundException() : worker.tasks;
    } catch (error) {
      if (error instanceof EntityNotFoundError)
        throw new NotFoundException(`There is no user with ${workerId}!`);
      else
        throw new InternalServerErrorException(error);
    }
  }
  async findByTeam(teamId: number): Promise<Task[] | NotFoundException>{
    try {

      const team: Team = await this.teamsRepository.findOneOrFail({
        where: { id: teamId },
        relations: { tasks: true },
      });
      return (!team.tasks.length) ? 
        new NotFoundException(`${team.name} has no tasks yet!`):
      team.tasks;
    }catch (error) {
      if (error instanceof EntityNotFoundError)
        throw new NotFoundException(`There is no task with ${teamId}`);
      throw new InternalServerErrorException(error);
    }
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
    taskId: number,
    teamId: number,
  ): Promise<object | string> {
    const team: Team = (
      await this.teamsRepository.find({
        where: {
          id: teamId,
          isActive: true,
        },
        relations: {
          tasks: true,
        },
      })
    ).at(0);
    if (team === null) return `${teamId} could not found!`;
    const task: Task = (
      await this.tasksRepository.find({
        where: {
          id: taskId,
          isActive: true,
        },
        relations: {
          teams: true,
        },
      })
    ).at(0);
    team.tasks.push(task);
    task.teams.push(team);
    const result: Task = await this.tasksRepository.save(task);

    return {
      message: `Task is created successfully with ${result.id} id!`,
      taskId: result.id,
    };
  }
}
