import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { USER_PROVIDERS } from './user.providers';

import { RedisCacheInterceptor } from './Interceptors/redis-cache.interceptor';
import { RedisCacheMiddleware } from './middlewares/redis.middleware';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [UsersController],
  providers: [
    ...Object.values(USER_PROVIDERS.USE_CASES),
    ...Object.values(USER_PROVIDERS.REPOSITORIES),
    ...Object.values(USER_PROVIDERS.HASH),
    RedisCacheMiddleware,
    RedisCacheInterceptor,
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedisCacheMiddleware).forRoutes(UsersController);
  }
}
