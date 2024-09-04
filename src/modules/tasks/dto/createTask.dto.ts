import {
  IsEnum,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsDate,
} from 'class-validator'
import { TaskPriority, TaskStatus } from '../enums/task.enum'
import { SwaggerDecorators } from '../../../common/decorator/swagger.decorators'

export class CreateTaskDto {
  @SwaggerDecorators.name()
  @IsNotEmpty()
  @IsString()
  name: string

  @SwaggerDecorators.dueDate()
  @IsNotEmpty()
  @IsDateString()
  dueDate: string

  @SwaggerDecorators.status(TaskStatus)
  @IsEnum(TaskStatus)
  status: TaskStatus

  @SwaggerDecorators.priority(TaskPriority)
  @IsEnum(TaskPriority)
  priority: TaskPriority

  @SwaggerDecorators.isActive()
  @IsBoolean()
  isActive: boolean
}
