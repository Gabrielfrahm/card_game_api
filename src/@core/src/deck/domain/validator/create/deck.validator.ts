import { Card } from "#card/domain/entities/card";
import { ClassValidatorFields } from "#seedwork/domain";
import { User } from "#user/domain";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { DeckProps } from "deck/domain/entities/deck";

export class DeckRules {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  user: User;

  @IsOptional()
  @IsArray()
  cards?: Card[];

  @IsOptional()
  main_card?: Card;

  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  created_at?: Date;

  constructor(data: DeckProps) {
    Object.assign(this, data);
  }
}

export class DeckValidator extends ClassValidatorFields<DeckRules> {
  validate(data: DeckRules): boolean {
    return super.validate(new DeckRules(data ?? ({} as any)));
  }
}

export class DeckValidatorFactory {
  static create() {
    return new DeckValidator();
  }
}

export default DeckValidatorFactory;
