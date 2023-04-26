import { Entity, UniqueEntityId } from "#seedwork/domain";

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
};

export class Card extends Entity<CardProps> {
  constructor(public readonly props: CardProps, id?: UniqueEntityId) {
    super(props, id);
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
}
