import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { failResponse } from "../response.util";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message || message;
      errors = exception.getResponse()['errors'];
    }

    if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Not Found';
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log('exception', exception);
      message = exception.message;
    }

    response.status(status).json(failResponse(message, status, errors));
  }
}
