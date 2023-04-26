import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { CredentialError } from 'core/@seedwork/domain';
import { Response } from 'express';

@Catch(CredentialError)
export class CredentialValidationErrorFilter implements ExceptionFilter {
  catch(exception: CredentialError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
