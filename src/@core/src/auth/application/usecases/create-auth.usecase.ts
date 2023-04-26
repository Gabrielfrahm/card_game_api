import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { CredentialError } from "#seedwork/domain";
import { BcryptAdapter, HashCompare } from "#seedwork/infra";
import { UserRepository } from "#user/domain";

import { JWTAdapter } from "auth/infra";
import { AuthOutput } from "../dtos";
export namespace CreateAuthUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private compareHash: BcryptAdapter.CompareAdapter,
      private JwtAdapter: JWTAdapter
    ) {}
    async execute(input: Input): Promise<AuthOutput> {
      const user = await this.userRepository.findByEmail(input.email);
      const passwordMatched = await this.compareHash.compare(
        input.password,
        user.password
      );

      if (!passwordMatched) {
        throw new CredentialError("Incorrect email/password combination");
      }

      const token = this.JwtAdapter.generateToken(
        {
          sub: user.id,
          name: user.name,
        },
        { expiresIn: process.env.JWT_EXPIRED }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          email_confirmation: user.email_confirmation,
        },
        token,
      };
    }
  }

  export type Input = {
    email: string;
    password: string;
  };

  export type Output = AuthOutput;
}
