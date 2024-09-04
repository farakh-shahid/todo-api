import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTPS')

  use(req: Request, res: Response, next: NextFunction) {
    const {
      method,
      originalUrl: url,
      headers: { referer },
      headers: { 'user-agent': userAgent },
    } = req
    const start = Date.now()

    res.on('finish', () => {
      const { statusCode } = res
      const contentLength = res.get('content-length') ?? ''
      const responseTime = Date.now() - start

      this.logRequest(
        method,
        url,
        statusCode,
        contentLength,
        responseTime,
        referer ?? '',
        userAgent ?? '',
      )
    })

    next()
  }

  private logRequest(
    method: string,
    url: string,
    statusCode: number,
    contentLength: string,
    responseTime: number,
    referer: string,
    userAgent: string,
  ) {
    const logFormat = `${method} ${url} ${statusCode} - ${
      contentLength || 0
    } bytes - ${responseTime}ms - Referrer: ${referer || 'N/A'} - User Agent: ${userAgent}`
    if (statusCode >= 500) {
      this.logger.error(logFormat)
    } else if (statusCode >= 400) {
      this.logger.warn(logFormat)
    } else {
      this.logger.log(logFormat)
    }
  }
}
