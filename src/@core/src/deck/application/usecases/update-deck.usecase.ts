import { Card, CardRepository } from "#card/domain";
import { DeckRepository } from "#deck/domain";
import { default as DefaultUseCase } from "#seedwork/application/usecase";

import { DeckOutput } from "../dtos";
import DeckOutputMapper from "../mappers/deck-output.mapper";

export namespace UpdateDeckUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private deckRepository: DeckRepository.Repository,
      private cardRepository: CardRepository.Repository
    ) {}
    async execute(input: Input): Promise<Output> {
      let cards: Card[] = [];
      let main_card: Card;
      const entity = await this.deckRepository.findById(input.id);
      if (input.cards) {
        input.cards.map(async (item) => {
          cards.push(await this.cardRepository.findById(item));
        });
      }

      if (input.main_card_id) {
        main_card = await this.cardRepository.findById(input.main_card_id);
      }
      entity.update({ name: input.name, main_card, cards });

      await this.deckRepository.update(entity);
      return DeckOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
    name?: string;
    cards?: string[];
    main_card_id?: string;
  };

  export type Output = DeckOutput;
}

export default UpdateDeckUseCase;
