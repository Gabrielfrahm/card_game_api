/* eslint-disable @typescript-eslint/no-namespace */

import { CreateUserUseCase, GetUserUseCase } from 'core/user/application';

import { UserInMemoryRepository, UserPrismaRepository } from 'core/user/infra';
import { prismaClient } from 'core/@seedwork/infra';

export namespace USER_PROVIDERS {
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

  export namespace USE_CASES {
    export const CREATE_USER_USE_CASE = {
      provide: CreateUserUseCase.UseCase,
      useFactory: (userRepo: UserPrismaRepository) => {
        return new CreateUserUseCase.UseCase(userRepo);
      },
      inject: [REPOSITORIES.USER_REPOSITORY.provide],
    };
    export const GET_USER_USE_CASE = {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepo: UserPrismaRepository) => {
        return new GetUserUseCase.UseCase(userRepo);
      },
      inject: [REPOSITORIES.USER_REPOSITORY.provide],
    };
  }
}
