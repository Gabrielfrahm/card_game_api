import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CreateDeckUseCase } from 'core/deck/application';

export class CreateDeckDto implements CreateDeckUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsOptional()
  @IsArray()
  cards?: string[];

  @IsOptional()
  @IsString()
  main_card_id?: string;

  @IsOptional()
  created_at?: Date;
}
