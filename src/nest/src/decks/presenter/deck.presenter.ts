import { Card, User } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { DeckOutput, ListDeckUseCase } from 'core/deck/application';
import { CollectionPresenter } from '../../@share/presenters/collection.presenter';

export type UserOmit = Omit<User, 'updated_at'>;
export type CardOmit = Omit<Card, 'updated_at'>;

export class DeckPresenter {
  id: string;
  name: string;
  user: UserOmit;
  cards?: CardOmit[];
  main_card?: CardOmit;
  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: DeckOutput) {
    this.id = output.id;
    this.name = output.name;
    this.user = output.user;
    this.cards = output.cards;
    this.main_card = output.main_card;
    this.created_at = output.created_at;
  }
}

export class DeckCollectionPresenter extends CollectionPresenter {
  @Exclude()
  protected _data: DeckPresenter[];

  constructor(output: ListDeckUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this._data = items.map((item: DeckOutput) => new DeckPresenter(item));
  }

  @Expose({ name: 'data' })
  get data() {
    return this._data;
  }
}
