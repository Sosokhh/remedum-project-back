import { ValidationError } from '@nestjs/common';

function handleDefault(
  constraintValue: string,
  message: any,
  errorField: string,
) {
  if (!message[errorField]) {
    message[errorField] = [];
  }
  message[errorField].push(constraintValue);
}

function handleConstraintMessageChange(
  constraintKey: string,
  constraintValue: string,
  message: any,
  errorField: string,
) {
  switch (constraintKey) {
    case 'isNotEmpty':
      handleDefault('Should not be empty', message, errorField);
      break;
    case 'HasMimeType':
      handleDefault(
        'File types must be: ' + constraintValue,
        message,
        errorField,
      );
      break;
    case 'MaxFileSize':
      handleDefault(
        'File size limit should be: ' + constraintValue,
        message,
        errorField,
      );
      break;
    case 'IsFile':
      handleDefault('File is required', message, errorField);
      break;
    case 'IsArray':
      handleDefault('IsArray', message, errorField);
      break;
    case 'IsArrayAndValidFiles':
      handleDefault('IsArrayAndValidFiles', message, errorField);
      break;
    default:
      handleDefault(constraintValue, message, errorField);
      break;
  }
}

export function errorFormatter(
  errors: ValidationError[],
  errMessage?: any,
  parentField?: string,
): any {
  const message = errMessage || {};
  let errorField = '';

  errors.forEach((error) => {
    errorField = parentField
      ? `${parentField}.${error.property}`
      : error?.property;

    if (!error?.constraints && error?.children?.length) {
      // Recursively handle nested errors
      errorFormatter(error.children, message, errorField);
    } else {
      const constraints = error.constraints || {};

      Object.entries(constraints).forEach(
        ([constraintKey, constraintValue]) => {
          handleConstraintMessageChange(
            constraintKey,
            constraintValue,
            message,
            errorField,
          );
        },
      );
    }
  });

  return message;
}
