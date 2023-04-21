import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { USER_PROVIDERS } from './user.providers';
import { RedisCacheMiddleware } from '../@share/middlewares/redis.middleware';
import { RedisCacheInterceptor } from '../@share/Interceptors/redis-cache.interceptor';

@Module({
  controllers: [UsersController],
  providers: [
    ...Object.values(USER_PROVIDERS.USE_CASES),
    ...Object.values(USER_PROVIDERS.REPOSITORIES),
    RedisCacheMiddleware,
    RedisCacheInterceptor,
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedisCacheMiddleware).forRoutes(UsersController);
  }
}
