import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EntityValidationErrorFilter } from './@share/exception-filters/entity-validation-error/entity-validation-error.filter';
import { AlreadyExistingValidationFilter } from './@share/exception-filters/already-existing-validation/already-existing-validation.filter';
import { NotFoundValidationErrorFilter } from './@share/exception-filters/not-found-validation-error/exception';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new EntityValidationErrorFilter(),
    new AlreadyExistingValidationFilter(),
    new NotFoundValidationErrorFilter(),
  );
}
