import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CardRules {
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
}
