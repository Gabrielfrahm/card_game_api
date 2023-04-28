import { ListCardUseCase } from 'core/card/application';

import { IsOptional } from 'class-validator';
import { SortDirection } from 'core/@seedwork/domain';

export class SearchCardDto implements ListCardUseCase.Input {
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
