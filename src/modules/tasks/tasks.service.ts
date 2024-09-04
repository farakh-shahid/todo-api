import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './entities/task.entity'
import { CreateTaskDto } from './dto/createTask.dto'
import { TaskFilters } from 'src/interfaces/task.interface'
import { buildTaskFilters } from './helpers/helper'
import { ERROR_MESSAGES } from '../../utils/constants'

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskData: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskData)
    return this.taskRepository.save(task)
  }

  async updateTask(
    id: number,
    updateTaskData: Partial<CreateTaskDto>,
  ): Promise<Task> {
    console.log('updateTaskData', updateTaskData)
    const task = await this.findTaskById(id)
    if (!task) {
      throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND(id))
    }

    await this.taskRepository.update(id, updateTaskData)
    return this.taskRepository.findOne({ where: { id } })
  }

  async deleteTask(id: number): Promise<void> {
    await this.findTaskById(id)
    await this.taskRepository.delete(id)
  }

  async listAllTasks(
    page: number,
    limit: number,
  ): Promise<{ data: Task[]; total: number }> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    return { data: tasks, total }
  }

  async getTaskById(id: number): Promise<Task> {
    return this.findTaskById(id)
  }

  async filterTask(
    page: number,
    limit: number,
    filters: TaskFilters,
  ): Promise<{ data: Task[]; total: number }> {
    const where = buildTaskFilters(filters)
    const [tasks, total] = await this.taskRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    if (tasks.length === 0) {
      throw new NotFoundException(ERROR_MESSAGES.NO_TASKS_FOUND)
    }
    return { data: tasks, total }
  }

  private async findTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } })
    if (!task) {
      throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND(id))
    }
    return task
  }
}
