export function successResponse(data?: any) {
  return {
    status: 'success',
    data,
  };
}

export function failResponse(
  message: string = 'Internal Server Error',
  statusCode: number = 500,
  errors: object = {},
) {
  return {
    status: 'fail',
    statusCode,
    message,
    ...(Object.keys(errors).length > 0 && { errors: errors }),
  };
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBadRequestException extends HttpException {
  constructor(errors: Record<string, string>) {
    super(
      {
        status: 'fail',
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad Request Exception',
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
