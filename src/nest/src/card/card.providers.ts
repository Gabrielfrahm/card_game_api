/* eslint-disable @typescript-eslint/no-namespace */

import { prismaClient } from 'core/@seedwork/infra';
import { JWTAdapter } from 'core/auth/infra';
import {
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardUseCase,
  ListCardUseCase,
} from 'core/card/application';
import { CardPrismaRepository } from 'core/card/infra';

export namespace CARD_PROVIDERS {
  export namespace REPOSITORIES {
    export const CARD_PRISMA_REPOSITORY = {
      provide: 'CardPrismaRepository',
      useFactory: () => {
        return new CardPrismaRepository(prismaClient);
      },
    };

    export const CARD_REPOSITORY = {
      provide: 'CardRepository',
      useExisting: 'CardPrismaRepository',
    };
  }

  export namespace JWT {
    export const JWT_ADAPTER = {
      provide: 'JWT',
      useFactory: () => {
        return new JWTAdapter(process.env.JWT_SECRET);
      },
    };
  }

  export namespace USE_CASES {
    export const CREATE_CARD_USE_CASE = {
      provide: CreateCardUseCase.UseCase,
      useFactory: (cardRepo: CardPrismaRepository) => {
        return new CreateCardUseCase.UseCase(cardRepo);
      },
      inject: [REPOSITORIES.CARD_REPOSITORY.provide],
    };
    export const GET_CARD_USE_CASE = {
      provide: GetCardUseCase.UseCase,
      useFactory: (cardRepo: CardPrismaRepository) => {
        return new GetCardUseCase.UseCase(cardRepo);
      },
      inject: [REPOSITORIES.CARD_REPOSITORY.provide],
    };
    export const LIST_CARD_USE_CASE = {
      provide: ListCardUseCase.UseCase,
      useFactory: (cardRepo: CardPrismaRepository) => {
        return new ListCardUseCase.UseCase(cardRepo);
      },
      inject: [REPOSITORIES.CARD_REPOSITORY.provide],
    };
    export const DELETE_CARD_USE_CASE = {
      provide: DeleteCardUseCase.UseCase,
      useFactory: (cardRepo: CardPrismaRepository) => {
        return new DeleteCardUseCase.UseCase(cardRepo);
      },
      inject: [REPOSITORIES.CARD_REPOSITORY.provide],
    };
  }
}
