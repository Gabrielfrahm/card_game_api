import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { USER_PROVIDERS } from './user.providers';

@Module({
  controllers: [UsersController],
  providers: [
    ...Object.values(USER_PROVIDERS.USE_CASES),
    ...Object.values(USER_PROVIDERS.REPOSITORIES),
  ],
})
export class UsersModule {}
