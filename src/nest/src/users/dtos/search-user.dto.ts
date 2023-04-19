import { ListUserUseCase } from 'core/user/application';
import { SortDirection } from 'core/dist/@seedwork/domain/repositories/repository-contracts';
import { IsOptional } from 'class-validator';

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
