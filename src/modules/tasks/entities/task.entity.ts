import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { TaskPriority, TaskStatus } from '../enums/task.enum'
import { SwaggerDecorators } from 'src/common/decorator/swagger.decorators'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  @SwaggerDecorators.id()
  id: number

  @Column()
  @SwaggerDecorators.name()
  name: string

  @Column({ type: 'date' })
  @SwaggerDecorators.dueDate()
  dueDate: Date

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  @SwaggerDecorators.status(TaskStatus)
  status: TaskStatus

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.BLUE,
  })
  @SwaggerDecorators.priority(TaskPriority)
  priority: TaskPriority

  @Column({ default: true })
  @SwaggerDecorators.isActive()
  isActive: boolean

  @CreateDateColumn()
  @SwaggerDecorators.createdAt()
  createdAt: Date

  @UpdateDateColumn()
  @SwaggerDecorators.updatedAt()
  updatedAt: Date
}
