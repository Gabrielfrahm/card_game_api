import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CARD_PROVIDERS } from './card.providers';

import { AuthenticatedMiddleware } from 'src/@share/middlewares/auth/authenticated.middleware';
import { RedisModule } from 'src/redis/redis.module';
import { RedisCacheMiddleware } from './middlewares/redis.middleware';
import { RedisCacheInterceptor } from './Interceptors/redis-cache.interceptor';

@Module({
  imports: [RedisModule],
  controllers: [CardController],
  providers: [
    ...Object.values(CARD_PROVIDERS.USE_CASES),
    ...Object.values(CARD_PROVIDERS.REPOSITORIES),
    ...Object.values(CARD_PROVIDERS.JWT),
    AuthenticatedMiddleware,
    RedisCacheMiddleware,
    RedisCacheInterceptor,
  ],
})
export class CardModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticatedMiddleware)
      .forRoutes(CardController)
      .apply(RedisCacheMiddleware)
      .forRoutes(CardController);
  }
}
