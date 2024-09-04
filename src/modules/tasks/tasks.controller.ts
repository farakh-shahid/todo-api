import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Put,
} from '@nestjs/common'
import { TaskService } from './tasks.service'
import { CreateTaskDto } from './dto/createTask.dto'

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto)
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: Partial<CreateTaskDto>,
  ) {
    return this.taskService.updateTask(id, updateTaskDto)
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number) {
    return this.taskService.deleteTask(id)
  }

  @Get('/list')
  async listAllTasks(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.taskService.listAllTasks(page, limit)
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number) {
    return this.taskService.getTaskById(id)
  }

  @Get()
  async filterTask(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string[],
    @Query('text') text?: string,
  ) {
    return this.taskService.filterTask(page, limit, {
      from,
      to,
      status,
      priority,
      text,
    })
  }
}
