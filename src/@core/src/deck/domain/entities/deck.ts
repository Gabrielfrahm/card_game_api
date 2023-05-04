import { Card } from "#card/domain";
import {
  Entity,
  EntityValidationError,
  UniqueEntityId,
} from "#seedwork/domain";
import { User } from "#user/domain";
import { DeckValidatorFactory } from "../validator/create";

export type DeckProps = {
  name: string;
  user: User;
  cards?: Card[];
  main_card?: Card;
  created_at?: Date;
};

export type DeckPropsUpdate = {
  name?: string;
  main_card?: Card;
};

export class Deck extends Entity<DeckProps> {
  constructor(public readonly props: DeckProps, id?: UniqueEntityId) {
    Deck.validate(props);
    super(props, id);
    this.props.created_at = this.created_at ?? new Date();
  }

  static validate(props: DeckProps) {
    const validator = DeckValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  addCard(card: Card): void {
    this.cards.push(card);
  }

  removeCard(cardId: string): void {
    const findCard = this.props.cards.find((item) => item.id === cardId);
    const index = this.props.cards.indexOf(findCard);
    if (index !== -1) {
      this.props.cards.splice(index, 1);
    }
  }

  update({ name, main_card }: DeckPropsUpdate) {
    if (name) {
      this.props.name = name;
    }
    if (main_card) {
      this.props.main_card = main_card;
    }
  }

  get name(): string {
    return this.props.name;
  }

  get user(): User {
    return this.props.user;
  }

  get cards(): Card[] {
    return this.props.cards;
  }

  get main_card(): Card {
    return this.props.main_card;
  }

  get created_at(): Date {
    return this.props.created_at;
  }
}
