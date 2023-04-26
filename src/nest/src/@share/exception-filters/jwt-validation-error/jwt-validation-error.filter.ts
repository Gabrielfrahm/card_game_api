import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { JWTError } from 'core/@seedwork/domain';
import { Response } from 'express';

@Catch(JWTError)
export class JWTValidationErrorFilter implements ExceptionFilter {
  catch(exception: JWTError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.UNAUTHORIZED;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
