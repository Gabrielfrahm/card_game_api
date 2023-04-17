import { ListUserUseCase } from 'core/user/application';
import { SortDirection } from 'core/dist/@seedwork/domain/repositories/repository-contracts';

export class SearchUserDto implements ListUserUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
  column?: string;
}
