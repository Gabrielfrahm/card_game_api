import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { BcryptAdapter } from "#seedwork/infra";
import { User, UserRepository } from "#user/domain";

import { UserOutput } from "../dtos";
import UserOutputMapper from "../mappers/user-output.mapper";

export namespace CreateUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hasher: BcryptAdapter.HasherAdapter
    ) {}
    async execute(input: Input): Promise<Output> {
      const entity = new User(this.hasher, input);
      await entity.setPassword(input.password);
      await this.userRepository.insert(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    email: string;
    name: string;
    password: string;
    created_at: Date;
  };

  export type Output = UserOutput;
}

export default CreateUserUseCase;
