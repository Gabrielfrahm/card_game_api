import {
  Entity,
  EntityValidationError,
  UniqueEntityId,
} from "#seedwork/domain";
import CardValidatorFactory from "../validator/create/card.validator";

export type CardProps = {
  name: string;
  number: number;
  category: string;
  image_url: string;
  description: string;
  atk: string;
  def: string;
  effect: string;
  main_card: boolean;
  created_at?: Date;
};

export class Card extends Entity<CardProps> {
  constructor(public readonly props: CardProps, id?: UniqueEntityId) {
    Card.validate(props);
    super(props, id);
    this.props.created_at = this.created_at ?? new Date();
  }

  static validate(props: CardProps) {
    const validator = CardValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  get name(): string {
    return this.props.name;
  }

  get number(): number {
    return this.props.number;
  }

  get category(): string {
    return this.props.category;
  }

  get image_url(): string {
    return this.props.image_url;
  }

  get description(): string {
    return this.props.description;
  }

  get atk(): string {
    return this.props.atk;
  }

  get def(): string {
    return this.props.def;
  }

  get effect(): string {
    return this.props.effect;
  }

  get main_card(): boolean {
    return this.props.main_card;
  }

  get created_at(): Date {
    return this.props.created_at;
  }
}
