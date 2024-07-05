// validation.pipe.ts
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from '@nestjs/common';
import { errorFormatter } from "../ErrorFormatter";

export const validationPipeConfig = new ValidationPipe({
  transform: true,
  disableErrorMessages: false,
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const message = errorFormatter(validationErrors);
    return new BadRequestException({ errors: message });
  },
});
