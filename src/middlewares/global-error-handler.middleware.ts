import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  private logger = new Logger('HTTP');
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    this.logger.error(error);
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      message: error.message || 'Internal server error', // You can customize the error message
    });
  }
}
