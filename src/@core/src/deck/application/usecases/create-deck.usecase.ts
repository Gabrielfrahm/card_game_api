import { Card, CardRepository } from "#card/domain";
import { Deck, DeckRepository } from "#deck/domain";
import { default as DefaultUseCase } from "#seedwork/application/usecase";

import { DeckOutput } from "../dtos";
import { UserRepository } from "#user/domain";
import DeckOutputMapper from "../mappers/deck-output.mapper";

export namespace CreateDeckUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private deckRepository: DeckRepository.Repository,
      private cardRepository: CardRepository.Repository,
      private userRepository: UserRepository.Repository
    ) {}
    async execute(input: Input): Promise<Output> {
      let cards = [];
      let main_card;
      const user = await this.userRepository.findById(input.user_id);

      if (input.cards) {
        input.cards.map(async (item) => {
          cards.push(await this.cardRepository.findById(item));
        });
      }

      if (input.main_card_id) {
        main_card = await this.cardRepository.findById(input.main_card_id);
      }

      const entity = new Deck({
        name: input.name,
        user,
        cards,
        main_card,
        created_at: input.created_at,
      });

      await this.deckRepository.insert(entity);
      return DeckOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    name: string;
    user_id: string;
    cards?: string[];
    main_card_id?: string;
    created_at?: Date;
  };

  export type Output = DeckOutput;
}

export default CreateDeckUseCase;
