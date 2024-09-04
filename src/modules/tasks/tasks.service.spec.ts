import { Test, TestingModule } from '@nestjs/testing'
import { Repository, UpdateResult } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Task } from './entities/task.entity'
import { NotFoundException } from '@nestjs/common'
import { ERROR_MESSAGES } from '../../utils/constants'
import { CreateTaskDto } from './dto/createTask.dto'
import { TaskFilters } from '../../interfaces/task.interface'
import { buildTaskFilters } from './helpers/helper'
import { TaskService } from './tasks.service'
import { TaskStatus, TaskPriority } from './enums/task.enum'

const mockTaskRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
})

describe('TaskService', () => {
  let taskService: TaskService
  let taskRepository: jest.Mocked<Repository<Task>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useFactory: mockTaskRepository,
        },
      ],
    }).compile()

    taskService = module.get<TaskService>(TaskService)
    taskRepository = module.get(getRepositoryToken(Task))
  })

  describe('createTask', () => {
    it('should create and save a task', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'Test Task',
        dueDate: new Date().toISOString(),
        status: TaskStatus.PENDING,
        priority: TaskPriority.BLUE,
        isActive: true,
      }

      const task = {
        id: 1,
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      taskRepository.create.mockReturnValue(task)
      taskRepository.save.mockResolvedValue(task)

      const result = await taskService.createTask(createTaskDto)

      expect(taskRepository.create).toHaveBeenCalledWith(createTaskDto)
      expect(taskRepository.save).toHaveBeenCalledWith(task)
      expect(result).toEqual(task)
    })
  })

  describe('updateTask', () => {
    it('should throw NotFoundException if task not found', async () => {
      taskRepository.findOne.mockResolvedValue(null) // Task not found

      await expect(taskService.updateTask(1, {})).rejects.toThrow(
        new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND(1)),
      )
    })

    it('should update and return the task', async () => {
      const task: Task = {
        id: 1,
        name: 'Test Task',
        dueDate: new Date(),
        status: TaskStatus.PENDING,
        priority: TaskPriority.BLUE,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      taskRepository.findOne.mockResolvedValue(task)

      const updateResult: UpdateResult = {
        affected: 1,
        generatedMaps: [],
        raw: [],
      }
      taskRepository.update.mockResolvedValue(updateResult)

      // Mock the updated task after update
      const updatedTask = { ...task, name: 'Updated Task' }
      taskRepository.findOne.mockResolvedValue(updatedTask)

      const result = await taskService.updateTask(1, { name: 'Updated Task' })

      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(taskRepository.update).toHaveBeenCalledWith(1, {
        name: 'Updated Task',
      })
      expect(result).toEqual(updatedTask)
    })
  })

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      await taskService.deleteTask(1)
      expect(taskRepository.delete).toHaveBeenCalledWith(1)
    })
  })

  describe('listAllTasks', () => {
    it('should return tasks with pagination', async () => {
      const tasks: Task[] = [
        {
          id: 1,
          name: 'Test Task',
          dueDate: new Date(),
          status: TaskStatus.PENDING,
          priority: TaskPriority.BLUE,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      taskRepository.findAndCount.mockResolvedValue([tasks, 1])

      const result = await taskService.listAllTasks(1, 10)

      expect(taskRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      })
      expect(result).toEqual({ data: tasks, total: 1 })
    })

    it('should throw NotFoundException if no tasks are found', async () => {
      taskRepository.findAndCount.mockResolvedValue([[], 0])

      await expect(taskService.listAllTasks(1, 10)).rejects.toThrow(
        new NotFoundException(ERROR_MESSAGES.NO_TASKS_FOUND),
      )
    })
  })

  describe('getTaskById', () => {
    it('should return the task if found', async () => {
      const task: Task = {
        id: 1,
        name: 'Test Task',
        dueDate: new Date(),
        status: TaskStatus.PENDING,
        priority: TaskPriority.BLUE,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      taskRepository.findOne.mockResolvedValue(task)

      const result = await taskService.getTaskById(1)

      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(result).toEqual(task)
    })

    it('should throw NotFoundException if task not found', async () => {
      taskRepository.findOne.mockResolvedValue(null)

      await expect(taskService.getTaskById(1)).rejects.toThrow(
        new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND(1)),
      )
    })
  })

  describe('filterTask', () => {
    it('should return tasks with filters and pagination', async () => {
      const filters: TaskFilters = { status: TaskStatus.PENDING }
      const tasks: Task[] = [
        {
          id: 1,
          name: 'Test Task',
          dueDate: new Date(),
          status: TaskStatus.PENDING,
          priority: TaskPriority.BLUE,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const where = buildTaskFilters(filters)

      taskRepository.findAndCount.mockResolvedValue([tasks, 1])

      const result = await taskService.filterTask(1, 10, filters)

      expect(taskRepository.findAndCount).toHaveBeenCalledWith({
        where,
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      })
      expect(result).toEqual({ data: tasks, total: 1 })
    })
  })
})
