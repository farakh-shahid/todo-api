import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './config/swagger.config'
import { ConfigService } from '@nestjs/config'
import { API_PREFIX, PORT } from './utils/constants'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './common/filters/exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  app.setGlobalPrefix(API_PREFIX)
  setupSwagger(app)
  app.enableShutdownHooks()
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter())
  const port = configService.get<number>(PORT) || 3000
  await app.listen(port)
}
bootstrap()
