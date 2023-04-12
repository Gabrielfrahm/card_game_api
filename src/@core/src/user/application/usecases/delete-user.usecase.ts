import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { UserRepository } from "#user/domain";

export namespace DeleteUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      await this.userRepository.delete(input.id);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = void;
}

export default DeleteUserUseCase;
