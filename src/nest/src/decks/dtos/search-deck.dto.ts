import { ListDeckUseCase } from 'core/deck/application';

import { IsOptional } from 'class-validator';
import { SortDirection } from 'core/@seedwork/domain';

export class SearchDeckDto implements ListDeckUseCase.Input {
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
