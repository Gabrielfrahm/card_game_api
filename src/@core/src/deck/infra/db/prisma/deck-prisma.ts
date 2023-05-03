import { Deck, DeckRepository } from "#deck/domain";
import {
  AlreadyExisting,
  NotFoundError,
  UniqueEntityId,
} from "#seedwork/domain";
import { PrismaClient } from "@prisma/client";

export class DeckPrismaRepository implements DeckRepository.Repository {
  sortableFields: string[] = ["name", "created_at"];
  constructor(private deckModel: PrismaClient) {}
  search(
    props: DeckRepository.SearchParams
  ): Promise<DeckRepository.DeckSearchResult> {
    throw new Error("Method not implemented.");
  }

  async insert(entity: Deck): Promise<void> {
    await this._getByName(entity.name);

    const createDeck = this.deckModel.deck.create({
      data: {
        id: entity.id,
        name: entity.name,
        user_id: entity.user.id,
        main_card_id: entity.main_card.id,
        created_at: entity.created_at,
      },
    });

    await this.deckModel.$transaction([
      createDeck,
      ...entity.cards.map((item) =>
        this.deckModel.deckCard.create({
          data: {
            deck_id: entity.id,
            card_id: item.id,
          },
        })
      ),
    ]);
  }

  async findById(id: string | UniqueEntityId): Promise<any> {
    const _id = `${id}`;
    const model = await this._get(_id);
    if (model) {
      return model;
    }
  }

  findByEmail?(email: string): Promise<Deck> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Deck[]> {
    throw new Error("Method not implemented.");
  }
  update(entity: Deck): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string | UniqueEntityId): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async _getByName(name: string): Promise<void> {
    const deck = await this.deckModel.deck.findFirst({
      where: { name: name },
    });

    if (deck) {
      throw new AlreadyExisting("Name already existing");
    }
  }

  private async _get(id: string) {
    const card = await this.deckModel.deck.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        user: true,
        DeckCard: true,
        card: true,
      },
    });

    if (!card) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return card;
  }
}
