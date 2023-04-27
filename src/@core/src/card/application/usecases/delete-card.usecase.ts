import { CardRepository } from "#card/domain";
import { default as DefaultUseCase } from "#seedwork/application/usecase";

export namespace DeleteCardUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cardRepository: CardRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      await this.cardRepository.delete(input.id);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = void;
}

export default DeleteCardUseCase;
