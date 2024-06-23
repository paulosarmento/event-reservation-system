import { NotFoundError } from 'libs/events-core/src/errors';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch(NotFoundError, BadRequestException)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof NotFoundError) {
      response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
    } else if (exception instanceof BadRequestException) {
      response.status(400).json({
        statusCode: 400,
        message: exception.message,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }
}
