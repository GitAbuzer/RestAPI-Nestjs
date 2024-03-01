import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryParamsDto } from './dto/task-query-params.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Get('getBy')
  async findAllByWorkerId(@Query() params: TaskQueryParamsDto) {
    return params.workerId
      ? await this.tasksService.findByWorkerId(params.workerId)
      : await this.tasksService.findByTeam(params.teamId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result: Task | string = await this.tasksService.findOne(+id);
    const status: HttpStatus =
      typeof result == 'string' ? HttpStatus.NOT_FOUND : HttpStatus.OK;
    return {
      status: status,
      response: result,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const result: string = await this.tasksService.update(+id, updateTaskDto);
    const status: HttpStatus = result.includes('wrong')
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;
    return `${status} ${result}`;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(+id);
  }
}
