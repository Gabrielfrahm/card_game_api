import {
  Deck as DeckP,
  User as UserP,
  DeckCard,
  Card as CardP,
} from "@prisma/client";
import { Deck as Entity } from "#deck/domain";
import {
  EntityValidationError,
  LoadEntityError,
  UniqueEntityId,
} from "#seedwork/domain";
import { User } from "#user/domain";
import { BcryptAdapter } from "#seedwork/infra";
import { Card } from "#card/domain";

type DeckCardsProps = {
  id: string;
  deck_id: string;
  card_id: string;
  created_at: Date;
  updated_at: Date;
  card: Omit<CardP, "updated_at">;
};

type ModelProps = {
  id: string;
  name: string;
  user: UserP;
  user_id: string;
  DeckCard: DeckCardsProps[];
  card: Omit<CardP, "updated_at">;
  main_card_id: string;
  created_at: Date;
};

export class DeckModelMapper {
  static toEntity(model: ModelProps) {
    let cards: Card[];
    let main_card: Card;
    const user = new User(
      new BcryptAdapter.HasherAdapter(12),
      {
        email: model.user.email,
        name: model.user.name,
        password: model.user.password,
        email_confirmation: model.user.email_confirmation,
        created_at: model.user.created_at,
      },
      new UniqueEntityId(model.user.id)
    );
    if (model.card) {
      main_card = new Card(
        {
          ...model.card,
        },
        new UniqueEntityId(model.card.id)
      );
    }
    if (model.DeckCard) {
      cards = model.DeckCard.map(
        (item) =>
          new Card({
            ...item.card,
          })
      );
    }
    const deck = new Entity(
      {
        name: model.name,
        user: user,
        cards: cards,
        main_card,
        created_at: model.created_at,
      },
      new UniqueEntityId(model.id)
    );
    try {
      return deck;
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.error);
      }
      throw e;
    }
  }
}
