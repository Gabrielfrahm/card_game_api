import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { AlreadyExisting } from 'core/@seedwork/domain';
import { Response } from 'express';

@Catch(AlreadyExisting)
export class AlreadyExistingValidationFilter implements ExceptionFilter {
  catch(exception: AlreadyExisting, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.CONFLICT;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
