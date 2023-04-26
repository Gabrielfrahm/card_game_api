import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EntityValidationErrorFilter } from './@share/exception-filters/entity-validation-error/entity-validation-error.filter';
import { AlreadyExistingValidationFilter } from './@share/exception-filters/already-existing-validation/already-existing-validation.filter';
import { NotFoundValidationErrorFilter } from './@share/exception-filters/not-found-validation-error/not-found-validation-error.filter';
import { CredentialValidationErrorFilter } from './@share/exception-filters/credential-validation-error/credential-validation-error.filter';

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
    new CredentialValidationErrorFilter(),
  );
}
