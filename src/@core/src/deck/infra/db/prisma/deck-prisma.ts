import { Deck, DeckRepository } from "#deck/domain";
import {
  AlreadyExisting,
  NotFoundError,
  UniqueEntityId,
} from "#seedwork/domain";
import { PrismaClient } from "@prisma/client";
import { DeckModelMapper } from "./deck-model.mapper";

export class DeckPrismaRepository implements DeckRepository.Repository {
  sortableFields: string[] = ["name", "created_at"];
  constructor(private deckModel: PrismaClient) {}

  async search(
    props: DeckRepository.SearchParams,
    user_id: string
  ): Promise<DeckRepository.DeckSearchResult> {
    const skip = (props.page - 1) * props.per_page;
    const take = props.per_page;

    const decks = await this.deckModel.deck.findMany({
      where: {
        AND: [
          {
            user_id: {
              contains: user_id,
            },
          },
          {
            ...(props.filter && {
              [props.column]: {
                contains: props.filter,
              },
            }),
          },
        ],
      },
      orderBy: {
        [props.sort ?? "created_at"]: props.sort_dir ?? "desc",
      },
      select: {
        id: true,
        name: true,
        user: {
          select: {
            id: true,
            email: true,
            email_confirmation: true,
            name: true,
            password: true,
            created_at: true,
          },
        },
        user_id: true,
        DeckCard: {
          include: {
            card: {
              select: {
                id: true,
                name: true,
                number: true,
                description: true,
                category: true,
                atk: true,
                def: true,
                effect: true,
                image_url: true,
                main_card: true,
                created_at: true,
              },
            },
          },
        },
        card: {
          select: {
            id: true,
            name: true,
            number: true,
            description: true,
            category: true,
            atk: true,
            def: true,
            effect: true,
            image_url: true,
            main_card: true,
            created_at: true,
          },
        },
        main_card_id: true,
        created_at: true,
        _count: true,
      },
      take: take,
      skip: skip,
    });

    const count = await this.deckModel.deck.count({
      where: {
        AND: [
          {
            user_id: {
              contains: user_id,
            },
          },
          {
            ...(props.filter && {
              [props.column]: {
                contains: props.filter,
              },
            }),
          },
        ],
      },
      ...(props.filter && {
        where: {
          [props.column]: {
            contains: props.filter,
          },
        },
      }),
      orderBy: {
        [props.sort ?? "created_at"]: props.sort_dir ?? "desc",
      },
    });

    return new DeckRepository.DeckSearchResult({
      items: decks.map((item) => DeckModelMapper.toEntity(item)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir,
      column: props.column,
    });
  }

  async insert(entity: Deck): Promise<void> {
    await this._getByName(entity.name);

    await this.deckModel.deck.create({
      data: {
        id: entity.id,
        name: entity.name,
        user_id: entity.user.id,
        main_card_id: entity.main_card ? entity.main_card.id : null,
        created_at: entity.created_at,
      },
    });

    if (entity.cards) {
      entity.cards.map(
        async (item) =>
          await this.deckModel.deckCard.create({
            data: {
              deck_id: entity.id,
              card_id: item.id,
            },
          })
      );
    }
  }

  async findById(
    id: string | UniqueEntityId
  ): Promise<Omit<Deck, "updated_at">> {
    const _id = `${id}`;
    const model = await this._get(_id);
    if (model) {
      return DeckModelMapper.toEntity(model);
    }
  }

  async findAll(user_id: string): Promise<Deck[]> {
    const model = await this.deckModel.deck.findMany({
      ...(user_id && {
        where: {
          user_id: user_id,
        },
      }),
      select: {
        id: true,
        name: true,
        user: true,
        user_id: true,
        DeckCard: {
          include: {
            card: true,
          },
        },
        card: true,
        main_card_id: true,
        created_at: true,
      },
    });
    return model.map((item) => DeckModelMapper.toEntity(item));
  }

  async update(entity: Deck): Promise<void> {
    const model = await this._get(entity.id);
    await this._getByName(entity.name, entity.id);

    await this.deckModel.deck.update({
      where: {
        id: entity.id,
      },
      data: {
        name: entity.name,
        main_card_id: entity.main_card ? entity.main_card.id : null,
      },
    });

    if (entity.cards) {
      const checkDeckCard = await this.deckModel.deckCard.findMany({
        where: {
          deck_id: model.id,
        },
      });

      if (checkDeckCard.length > 0) {
        await this.deckModel.deckCard.deleteMany({
          where: {
            deck_id: model.id,
          },
        });
      }

      if (entity.cards.length > 0) {
        entity.cards.forEach(
          async (item) =>
            await this.deckModel.deckCard.create({
              data: {
                deck_id: entity.id,
                card_id: item.id,
              },
            })
        );
      }
    }

    // await this.deckModel.$transaction([
    //   this.deckModel.deckCard.deleteMany({
    //     where: {
    //       deck_id: model.id,
    //     },
    //   }),
    //   ...entity.cards.map((item) =>
    //     this.deckModel.deckCard.create({
    //       data: {
    //         deck_id: entity.id,
    //         card_id: item.id,
    //       },
    //     })
    //   ),
    //   this.deckModel.deck.update({
    //     where: {
    //       id: entity.id,
    //     },
    //     data: {
    //       name: entity.name,
    //       main_card_id: entity.main_card ? entity.main_card.id : null,
    //     },
    //   }),
    // ]);
  }

  async delete(id: string): Promise<void> {
    const _id = `${id}`;
    await this._get(_id);
    await this.deckModel.deck.delete({
      where: {
        id: _id,
      },
    });
  }

  private async _getByName(name: string, id?: string): Promise<void> {
    if (id) {
      const deck = await this.deckModel.deck.findFirst({
        where: { name: name },
      });

      if (deck && deck.id !== id) {
        throw new AlreadyExisting("Name already existing");
      }
    } else {
      const deck = await this.deckModel.deck.findFirst({
        where: { name: name },
      });

      if (deck) {
        throw new AlreadyExisting("Name already existing");
      }
    }
  }

  private async _get(id: string) {
    const deck = await this.deckModel.deck.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        user: true,
        user_id: true,
        DeckCard: {
          include: {
            card: {
              select: {
                id: true,
                name: true,
                number: true,
                description: true,
                category: true,
                atk: true,
                def: true,
                effect: true,
                image_url: true,
                main_card: true,
                created_at: true,
              },
            },
          },
        },
        card: {
          select: {
            id: true,
            name: true,
            number: true,
            description: true,
            category: true,
            atk: true,
            def: true,
            effect: true,
            image_url: true,
            main_card: true,
            created_at: true,
          },
        },
        main_card_id: true,
        created_at: true,
      },
    });

    if (!deck) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return deck;
  }
}
