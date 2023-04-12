import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { UserRepository } from "#user/domain";
import { UserOutput } from "../dtos";
import UserOutputMapper from "../mappers/user-output.mapper";

export namespace UpdateUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);
      entity.update({
        email: input.email,
        name: input.name,
        password: input.password,
      });

      if (input.password) {
        entity.setPassword(input.password);
      }

      if (input.email_confirmation === true) {
        entity.confirm();
      }

      await this.userRepository.update(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
    email?: string;
    email_confirmation?: boolean;
    name?: string;
    password?: string;
  };

  export type Output = UserOutput;
}

export default UpdateUserUseCase;
