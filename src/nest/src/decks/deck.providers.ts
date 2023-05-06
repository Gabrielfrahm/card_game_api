/* eslint-disable @typescript-eslint/no-namespace */

import { prismaClient } from 'core/@seedwork/infra';
import { JWTAdapter } from 'core/auth/infra';
import { CardPrismaRepository } from 'core/card/infra';
import {
  CreateDeckUseCase,
  DeleteDeckUseCase,
  UpdateDeckUseCase,
  GetDeckUseCase,
  ListDeckUseCase,
} from 'core/deck/application';
import { DeckPrismaRepository } from 'core/deck/infra';
import { UserPrismaRepository } from 'core/user/infra';

export namespace DECK_PROVIDERS {
  export namespace REPOSITORIES {
    export const DECK_PRISMA_REPOSITORY = {
      provide: 'DeckPrismaRepository',
      useFactory: () => {
        return new DeckPrismaRepository(prismaClient);
      },
    };

    export const CARD_PRISMA_REPOSITORY = {
      provide: 'CardPrismaRepository',
      useFactory: () => {
        return new CardPrismaRepository(prismaClient);
      },
    };

    export const USER_PRISMA_REPOSITORY = {
      provide: 'UserPrismaRepository',
      useFactory: () => {
        return new UserPrismaRepository(prismaClient);
      },
    };

    export const DECK_REPOSITORY = {
      provide: 'DeckRepository',
      useExisting: 'DeckPrismaRepository',
    };

    export const USER_REPOSITORY = {
      provide: 'UserRepository',
      useExisting: 'UserPrismaRepository',
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
    export const CREATE_DECK_USE_CASE = {
      provide: CreateDeckUseCase.UseCase,
      useFactory: (
        deckRepo: DeckPrismaRepository,
        cardPrismaRepository: CardPrismaRepository,
        userPrismaRepository: UserPrismaRepository,
      ) => {
        return new CreateDeckUseCase.UseCase(
          deckRepo,
          cardPrismaRepository,
          userPrismaRepository,
        );
      },
      inject: [
        REPOSITORIES.DECK_REPOSITORY.provide,
        REPOSITORIES.CARD_REPOSITORY.provide,
        REPOSITORIES.USER_REPOSITORY.provide,
      ],
    };

    export const UPDATE_DECK_USE_CASE = {
      provide: UpdateDeckUseCase.UseCase,
      useFactory: (
        deckRepo: DeckPrismaRepository,
        cardPrismaRepository: CardPrismaRepository,
      ) => {
        return new UpdateDeckUseCase.UseCase(deckRepo, cardPrismaRepository);
      },
      inject: [
        REPOSITORIES.DECK_REPOSITORY.provide,
        REPOSITORIES.CARD_REPOSITORY.provide,
      ],
    };

    export const GET_DECK_USE_CASE = {
      provide: GetDeckUseCase.UseCase,
      useFactory: (DeckRepo: DeckPrismaRepository) => {
        return new GetDeckUseCase.UseCase(DeckRepo);
      },
      inject: [REPOSITORIES.DECK_REPOSITORY.provide],
    };
    export const LIST_DECK_USE_CASE = {
      provide: ListDeckUseCase.UseCase,
      useFactory: (DeckRepo: DeckPrismaRepository) => {
        return new ListDeckUseCase.UseCase(DeckRepo);
      },
      inject: [REPOSITORIES.DECK_REPOSITORY.provide],
    };
    export const DELETE_DECK_USE_CASE = {
      provide: DeleteDeckUseCase.UseCase,
      useFactory: (DeckRepo: DeckPrismaRepository) => {
        return new DeleteDeckUseCase.UseCase(DeckRepo);
      },
      inject: [REPOSITORIES.DECK_REPOSITORY.provide],
    };
  }
}
