import { CardProps } from "#card/domain/entities/card";
import { ClassValidatorFields } from "#seedwork/domain";
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

  constructor(data: CardProps) {
    Object.assign(this, data);
  }
}

export class CardValidator extends ClassValidatorFields<CardRules> {
  validate(data: CardRules): boolean {
    return super.validate(new CardRules(data ?? ({} as any)));
  }
}

export class CardValidatorFactory {
  static create() {
    return new CardValidator();
  }
}

export default CardValidatorFactory;
