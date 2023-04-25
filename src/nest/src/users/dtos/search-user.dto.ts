import { ListUserUseCase } from 'core/user/application';

import { IsOptional } from 'class-validator';
import { SortDirection } from 'core/@seedwork/domain';

export class SearchUserDto implements ListUserUseCase.Input {
  @IsOptional()
  page?: number;

  @IsOptional()
  per_page?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  sort_dir?: SortDirection;

  @IsOptional()
  filter?: string;

  @IsOptional()
  column?: string;
}
