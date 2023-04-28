import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { USER_PROVIDERS } from './user.providers';

import { RedisCacheInterceptor } from './Interceptors/redis-cache.interceptor';
import { RedisCacheMiddleware } from './middlewares/redis.middleware';
import { RedisModule } from 'src/redis/redis.module';

import { AuthenticatedMiddleware } from 'src/@share/middlewares/auth/authenticated.middleware';
@Module({
  imports: [RedisModule],
  controllers: [UsersController],
  providers: [
    ...Object.values(USER_PROVIDERS.USE_CASES),
    ...Object.values(USER_PROVIDERS.REPOSITORIES),
    ...Object.values(USER_PROVIDERS.HASH),
    ...Object.values(USER_PROVIDERS.JWT),
    RedisCacheMiddleware,
    RedisCacheInterceptor,
    AuthenticatedMiddleware,
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticatedMiddleware)
      .exclude({ path: 'users', method: RequestMethod.POST })
      .forRoutes(UsersController)
      .apply(RedisCacheMiddleware)
      .forRoutes(UsersController);
  }
}
