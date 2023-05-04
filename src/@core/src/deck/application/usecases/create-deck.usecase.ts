import { Card, CardRepository } from "#card/domain";
import { Deck, DeckRepository } from "#deck/domain";
import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { User } from "@prisma/client";
import { DeckOutput } from "../dtos";
import { UserRepository } from "#user/domain";

export namespace CreateDeckUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private deckRepository: DeckRepository.Repository,
      private cardRepository: CardRepository.Repository,
      private userRepository: UserRepository.Repository
    ) {}
    async execute(input: Input): Promise<Output> {
      let cards;
      const user = await this.userRepository.findById(input.user_id);

      if (input.cards) {
        cards = input.cards.map(async (item) => {
          const dale = await this.cardRepository.findById(item);
        });
      }

      const entity = new Deck({});

      await this.deckRepository.insert(entity);
      // return CardOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
    name: string;
    user_id: string;
    cards?: string[];
    main_card_id?: string;
    created_at?: Date;
  };

  export type Output = DeckOutput;
}

export default CreateDeckUseCase;
