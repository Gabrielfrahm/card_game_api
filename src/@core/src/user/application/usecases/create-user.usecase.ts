import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { User, UserRepository } from "#user/domain";
import { BcryptAdapter } from "#user/infra";
import { UserOutput } from "../dtos";
import UserOutputMapper from "../mappers/user-output.mapper";

export namespace CreateUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const hasher = new BcryptAdapter(12);
      const entity = new User(hasher, input);
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
