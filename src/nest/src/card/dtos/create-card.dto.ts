import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateCardUseCase } from 'core/card/application';

export class CreateCardDto implements CreateCardUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  atk: string;

  @IsString()
  @IsNotEmpty()
  def: string;

  @IsString()
  @IsNotEmpty()
  effect: string;

  @IsBoolean()
  @IsNotEmpty()
  main_card: boolean;

  @IsOptional()
  created_at?: Date;
}
