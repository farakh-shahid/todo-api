import { ApiProperty } from '@nestjs/swagger'

export const SwaggerDecorators = {
  id: () =>
    ApiProperty({
      example: 1,
      description: 'The unique identifier of the task',
    }),
  name: () =>
    ApiProperty({
      example: 'Test API',
      description: 'The name of the task',
    }),
  dueDate: () =>
    ApiProperty({
      example: '2024-09-01',
      description: 'The due date of the task',
      type: 'string',
      format: 'date',
    }),
  status: (TaskStatus) =>
    ApiProperty({
      example: TaskStatus.PENDING,
      enum: TaskStatus,
      description: 'The current status of the task',
    }),
  priority: (TaskPriority) =>
    ApiProperty({
      example: TaskPriority.BLUE,
      enum: TaskPriority,
      description: 'The priority of the task',
    }),
  isActive: () =>
    ApiProperty({
      example: true,
      description: 'Indicates if the task is active',
    }),
  createdAt: () =>
    ApiProperty({ description: 'The date when the task was created' }),
  updatedAt: () =>
    ApiProperty({ description: 'The date when the task was last updated' }),
}
