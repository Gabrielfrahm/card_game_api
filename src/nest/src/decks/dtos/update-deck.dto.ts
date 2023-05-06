import { IsArray, IsOptional, IsString } from 'class-validator';

import { UpdateDeckUseCase } from 'core/deck/application';

export class UpdateDeckDto implements Omit<UpdateDeckUseCase.Input, 'id'> {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  cards?: string[];

  @IsString()
  @IsOptional()
  main_card_id?: string;
}
