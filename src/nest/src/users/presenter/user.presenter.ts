import { Exclude, Expose, Transform } from 'class-transformer';
import { ListUserUseCase, UserOutput } from 'core/user/application';
import { CollectionPresenter } from '../../@share/presenters/collection.presenter';

export class UserPresenter {
  id: string;
  email: string;
  name: string;
  password: string;
  email_confirmation: boolean;
  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: UserOutput) {
    this.id = output.id;
    this.email = output.email;
    this.name = output.name;
    this.password = output.password;
    this.email_confirmation = output.email_confirmation;
    this.created_at = output.created_at;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  @Exclude()
  protected _data: UserPresenter[];

  constructor(output: ListUserUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this._data = items.map((item) => new UserPresenter(item));
  }

  @Expose({ name: 'data' })
  get data() {
    return this._data;
  }
}
