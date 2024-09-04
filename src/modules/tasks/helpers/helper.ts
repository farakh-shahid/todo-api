import { Between, Like, FindOptionsWhere, In } from 'typeorm'
import { Task } from '../entities/task.entity'
import { TaskPriority, TaskStatus } from '../enums/task.enum'
import { TaskFilters } from '../../../interfaces/task.interface'

/**
 * Builds a TypeORM `where` condition object for filtering tasks based on the provided filters.
 *
 * @param {TaskFilters} filters - The filters object.
 *
 * @returns {FindOptionsWhere<Task>} - A TypeORM `where` condition object.
 */

export const buildTaskFilters = (
  filters: TaskFilters,
): FindOptionsWhere<Task> => {
  const where: FindOptionsWhere<Task> = {}

  if (filters.from && !isNaN(Date.parse(filters.from))) {
    const fromDate = new Date(filters.from)
    const toDate =
      filters.to && !isNaN(Date.parse(filters.to))
        ? new Date(filters.to)
        : new Date()

    if (fromDate && toDate) {
      where.dueDate = Between(fromDate, toDate)
    }
  }

  if (
    filters.status &&
    Object.values(TaskStatus).includes(filters.status as TaskStatus)
  ) {
    where.status = filters.status as TaskStatus
  }

  if (filters.priority && Array.isArray(filters.priority)) {
    const validPriorities = filters.priority
      .map((priority) => priority.trim())
      .filter((priority) =>
        Object.values(TaskPriority).includes(priority as TaskPriority),
      )

    if (validPriorities.length > 0) {
      where.priority = In(validPriorities as TaskPriority[])
    }
  }

  if (filters.text) {
    where.name = Like(`%${filters.text}%`)
  }

  return where
}
