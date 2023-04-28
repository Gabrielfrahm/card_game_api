import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CARD_PROVIDERS } from './card.providers';

import { AuthenticatedMiddleware } from 'src/@share/middlewares/auth/authenticated.middleware';

@Module({
  controllers: [CardController],
  providers: [
    ...Object.values(CARD_PROVIDERS.USE_CASES),
    ...Object.values(CARD_PROVIDERS.REPOSITORIES),
    ...Object.values(CARD_PROVIDERS.JWT),
    AuthenticatedMiddleware,
  ],
})
export class CardModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticatedMiddleware).forRoutes(CardController);
  }
}
