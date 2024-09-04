import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DATABASE_CONFIG, POSTGRES } from '../utils/constants'

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: POSTGRES,
  host: configService.get<string>(DATABASE_CONFIG.HOST),
  port: configService.get<number>(DATABASE_CONFIG.PORT),
  username: configService.get<string>(DATABASE_CONFIG.USERNAME),
  password: configService.get<string>(DATABASE_CONFIG.PASSWORD),
  database: configService.get<string>(DATABASE_CONFIG.DB_NAME),
  synchronize: true,
  autoLoadEntities: true,
  migrations: ['src/migrations/*.ts'],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
})
