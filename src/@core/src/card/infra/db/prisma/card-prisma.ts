import { Card, CardRepository } from "#card/domain";
import {
  AlreadyExisting,
  NotFoundError,
  UniqueEntityId,
} from "#seedwork/domain";
import { PrismaClient } from "@prisma/client";
import { CardModelMapper } from "./card-model.mapper";

export class CardPrismaRepository implements CardRepository.Repository {
  sortableFields: string[] = [
    "name",
    "number",
    "category",
    "description",
    "atk",
    "def",
    "effect",
    "main_card",
    "created_at",
  ];

  constructor(private cardModel: PrismaClient) {}

  async insert(entity: Card): Promise<void> {
    await this._getByName(entity.name);
    await this._getByNumber(entity.number);

    await this.cardModel.card.create({
      data: {
        id: entity.id,
        name: entity.name,
        number: entity.number,
        description: entity.description,
        category: entity.category,
        atk: entity.atk,
        def: entity.def,
        effect: entity.effect,
        image_url: entity.image_url,
        main_card: entity.main_card,
        created_at: entity.created_at,
      },
    });
  }

  async findById(id: string | UniqueEntityId): Promise<Card> {
    const _id = `${id}`;
    const model = await this._get(_id);
    if (model) {
      return CardModelMapper.toEntity(model);
    }
  }

  async findAll(): Promise<Card[]> {
    const models = await this.cardModel.card.findMany({
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
    });
    return models.map((item) => CardModelMapper.toEntity(item));
  }

  async update(_entity: Card): Promise<void> {
    throw new Error("method not implemented");
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`;
    await this._get(_id);
    await this.cardModel.card.delete({ where: { id: _id } });
  }

  async search(
    props: CardRepository.SearchParams
  ): Promise<CardRepository.CardSearchResult> {
    const skip = (props.page - 1) * props.per_page;
    const take = props.per_page;

    const cards = await this.cardModel.card.findMany({
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
        Deck: true,
        DeckCard: true,
        main_card: true,
        created_at: true,
      },
      take: take,
      skip: skip,
    });

    return new CardRepository.CardSearchResult({
      items: cards.map((item) => CardModelMapper.toEntity(item)),
      current_page: props.page,
      per_page: props.per_page,
      total: cards.length,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir,
      column: props.column,
    });
  }

  private async _get(id: string) {
    const card = await this.cardModel.card.findFirst({
      where: {
        id: id,
      },
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
    });

    if (!card) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return card;
  }

  private async _getByName(name: string): Promise<void> {
    const card = await this.cardModel.card.findUnique({
      where: { name: name },
    });

    if (card) {
      throw new AlreadyExisting("Name already existing");
    }
  }

  private async _getByNumber(number: number): Promise<void> {
    const card = await this.cardModel.card.findUnique({
      where: { number: number },
    });

    if (card) {
      throw new AlreadyExisting("Number already existing");
    }
  }
}
