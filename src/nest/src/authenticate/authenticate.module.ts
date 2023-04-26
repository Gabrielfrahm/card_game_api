import { Module } from '@nestjs/common';
import { AuthenticateController } from './authenticate.controller';
import { AUTH_PROVIDERS } from './authenticate.providers';

@Module({
  controllers: [AuthenticateController],
  providers: [
    ...Object.values(AUTH_PROVIDERS.USE_CASES),
    ...Object.values(AUTH_PROVIDERS.REPOSITORIES),
    ...Object.values(AUTH_PROVIDERS.HASH),
    ...Object.values(AUTH_PROVIDERS.JWT),
  ],
})
export class AuthenticateModule {}
