export const POSTGRES = 'postgres'
export const DATABASE_CONFIG = {
  HOST: 'DATABASE_HOST',
  PORT: 'DATABASE_PORT',
  USERNAME: 'DATABASE_USER',
  PASSWORD: 'DATABASE_PASSWORD',
  DB_NAME: 'DATABASE_NAME',
}
export const PORT = 'PORT'

export const ERROR_MESSAGES = {
  TASK_NOT_FOUND: (id: number) => `Task with ID ${id} not found`,
  NO_TASKS_FOUND: 'No tasks found with the given filters',
  NO_TASKS_AVAILABLE: 'No tasks available',
}

export const API_PREFIX = 'api'
