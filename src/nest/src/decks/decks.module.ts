import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DECK_PROVIDERS } from './deck.providers';
import { DecksController } from './decks.controller';
import { RedisCacheMiddleware } from './middlewares/redis.middleware';
import { RedisCacheInterceptor } from './Interceptors/redis-cache.interceptor';
import { AuthenticatedMiddleware } from 'src/@share/middlewares/auth/authenticated.middleware';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    ...Object.values(DECK_PROVIDERS.USE_CASES),
    ...Object.values(DECK_PROVIDERS.REPOSITORIES),
    ...Object.values(DECK_PROVIDERS.JWT),
    RedisCacheMiddleware,
    RedisCacheInterceptor,
  ],
  controllers: [DecksController],
})
export class DecksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticatedMiddleware)
      .forRoutes(DecksController)
      .apply(RedisCacheMiddleware)
      .forRoutes(DecksController);
  }
}
