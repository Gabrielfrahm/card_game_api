import { Exclude, Expose, Transform } from 'class-transformer';
import { CardOutput, ListCardUseCase } from 'core/card/application';
import { CollectionPresenter } from '../../@share/presenters/collection.presenter';

export class CardPresenter {
  id: string;
  name: string;
  number: number;
  category: string;
  image_url: string;
  description: string;
  atk: string;
  def: string;
  effect: string;
  main_card: boolean;
  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: CardOutput) {
    this.id = output.id;
    this.name = output.name;
    this.number = output.number;
    this.category = output.category;
    this.image_url = output.image_url;
    this.description = output.description;
    this.atk = output.atk;
    this.def = output.def;
    this.effect = output.effect;
    this.main_card = output.main_card;
    this.created_at = output.created_at;
  }
}

export class CardCollectionPresenter extends CollectionPresenter {
  @Exclude()
  protected _data: CardPresenter[];

  constructor(output: ListCardUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this._data = items.map((item) => new CardPresenter(item));
  }

  @Expose({ name: 'data' })
  get data() {
    return this._data;
  }
}
