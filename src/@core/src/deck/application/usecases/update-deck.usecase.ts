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
      let main_card: Card;
      const entity = await this.deckRepository.findById(input.id);
      if (!input.cards) {
        entity.clearCard();
      }
      if (input.cards) {
        entity.clearCard();
        input.cards.map(async (item) => {
          const card = await this.cardRepository.findById(item);
          if (card) {
            entity.addCard(card);
          }
        });
      }

      if (input.main_card_id) {
        main_card = await this.cardRepository.findById(input.main_card_id);
      }
      entity.update({ name: input.name, main_card });

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
