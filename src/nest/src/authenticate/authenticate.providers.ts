/* eslint-disable @typescript-eslint/no-namespace */

import { UserInMemoryRepository, UserPrismaRepository } from 'core/user/infra';
import { prismaClient, BcryptAdapter } from 'core/@seedwork/infra';
import { CreateAuthUseCase } from 'core/auth/application';
import { JWTAdapter } from 'core/auth/infra';

export namespace AUTH_PROVIDERS {
  export namespace REPOSITORIES {
    export const USER_IN_MEMORY_REPOSITORY = {
      provide: 'UserInMemoryRepository',
      useClass: UserInMemoryRepository,
    };
    export const USER_PRISMA_REPOSITORY = {
      provide: 'UserPrismaRepository',
      useFactory: () => {
        return new UserPrismaRepository(prismaClient);
      },
    };

    export const USER_REPOSITORY = {
      provide: 'UserRepository',
      useExisting: 'UserPrismaRepository',
    };
  }

  export namespace HASH {
    export const COMPARE_ADAPTER = {
      provide: 'bcryptAdapter',
      useFactory: () => {
        return new BcryptAdapter.CompareAdapter();
      },
    };
  }

  export namespace JWT {
    export const JWT_ADAPTER = {
      provide: 'jwtAdapter',
      useFactory: () => {
        return new JWTAdapter(process.env.JWT_SECRET);
      },
    };
  }

  export namespace USE_CASES {
    export const CREATE_AUTH_USE_CASE = {
      provide: CreateAuthUseCase.UseCase,
      useFactory: (
        userRepo: UserPrismaRepository,
        compareHasher: BcryptAdapter.CompareAdapter,
        jwt: JWTAdapter,
      ) => {
        return new CreateAuthUseCase.UseCase(userRepo, compareHasher, jwt);
      },
      inject: [
        REPOSITORIES.USER_REPOSITORY.provide,
        HASH.COMPARE_ADAPTER.provide,
        JWT.JWT_ADAPTER.provide,
      ],
    };
  }
}
