/* eslint-disable @typescript-eslint/no-namespace */

import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  ListUserUseCase,
  UpdateUserUseCase,
} from 'core/user/application';

import { UserInMemoryRepository, UserPrismaRepository } from 'core/user/infra';
import { prismaClient, BcryptAdapter } from 'core/@seedwork/infra';
import { JWTAdapter } from 'core/auth/infra';

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

  export namespace JWT {
    export const JWT_ADAPTER = {
      provide: 'JWT',
      useFactory: () => {
        return new JWTAdapter(process.env.JWT_SECRET);
      },
    };
  }

  export namespace HASH {
    export const BCRYPT_ADAPTER = {
      provide: 'bcryptAdapter',
      useFactory: () => {
        return new BcryptAdapter.HasherAdapter(12);
      },
    };
  }

  export namespace USE_CASES {
    export const CREATE_USER_USE_CASE = {
      provide: CreateUserUseCase.UseCase,
      useFactory: (
        userRepo: UserPrismaRepository,
        hasher: BcryptAdapter.HasherAdapter,
      ) => {
        return new CreateUserUseCase.UseCase(userRepo, hasher);
      },
      inject: [
        REPOSITORIES.USER_REPOSITORY.provide,
        HASH.BCRYPT_ADAPTER.provide,
      ],
    };
    export const UPDATE_USER_USE_CASE = {
      provide: UpdateUserUseCase.UseCase,
      useFactory: (userRepo: UserPrismaRepository) => {
        return new UpdateUserUseCase.UseCase(userRepo);
      },
      inject: [REPOSITORIES.USER_REPOSITORY.provide],
    };
    export const LIST_USER_USE_CASE = {
      provide: ListUserUseCase.UseCase,
      useFactory: (userRepo: UserPrismaRepository) => {
        return new ListUserUseCase.UseCase(userRepo);
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
    export const DELETE_USER_USE_CASE = {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepo: UserPrismaRepository) => {
        return new DeleteUserUseCase.UseCase(userRepo);
      },
      inject: [REPOSITORIES.USER_REPOSITORY.provide],
    };
  }
}
