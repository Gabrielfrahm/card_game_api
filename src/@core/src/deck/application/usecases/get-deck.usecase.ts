import { Card, CardRepository } from "#card/domain";
import { DeckRepository } from "#deck/domain";
import { default as DefaultUseCase } from "#seedwork/application/usecase";

import { DeckOutput } from "../dtos";
import DeckOutputMapper from "../mappers/deck-output.mapper";

export namespace GetDeckUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private deckRepository: DeckRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.deckRepository.findById(input.id);
      return DeckOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = DeckOutput;
}

export default GetDeckUseCase;
