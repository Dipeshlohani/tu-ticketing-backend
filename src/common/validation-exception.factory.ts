// src/common/validation-exception.factory.ts
import { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

export const validationPipeOptions: ValidationPipeOptions = {
  exceptionFactory: (errors: ValidationError[]) => {
    const validationErrors = errors.map(error => ({
      property: error.property,
      constraints: error.constraints,
    }));
    console.error(validationErrors, '--------------------------------')
    return new BadRequestException({
      message: 'Validation failed',
      errors: validationErrors,
    });
  },
};
