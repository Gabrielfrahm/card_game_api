import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { UserRepository } from "#user/domain";
import { UserOutput } from "../dtos";
import UserOutputMapper from "../mappers/user-output.mapper";

export namespace GetUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);
      return UserOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = UserOutput;
}

export default GetUserUseCase;
