import { DeckRepository } from "#deck/domain";
import { default as DefaultUseCase } from "#seedwork/application/usecase";

export namespace DeleteDeckUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private deckRepository: DeckRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      return await this.deckRepository.delete(input.id);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = void;
}

export default DeleteDeckUseCase;
