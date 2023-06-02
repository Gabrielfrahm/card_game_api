import {
  Entity,
  EntityValidationError,
  UniqueEntityId,
} from "#seedwork/domain";
import { MatchValidatorFactory } from "../validator/create";

export type MatchProps = {
  host_id: string;
  participant_id?: string;
  status?: string;
  created_at?: Date;
};

export class Match extends Entity<MatchProps> {
  constructor(public readonly props: MatchProps, id?: UniqueEntityId) {
    Match.validate(props);
    super(props, id);
    this.props.status = this.status ?? "awaiting_players";
    this.props.created_at = this.created_at ?? new Date();
  }

  static validate(props: MatchProps) {
    const validator = MatchValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  get host_id(): string {
    return this.props.host_id;
  }

  private set participant_id(value: string) {
    this.props.participant_id = value;
  }

  join(value: string): void {
    this.participant_id = value;
  }

  get participant_id(): string {
    return this.props.participant_id;
  }

  changeStatus(value: string) {
    this.status = value;
  }

  private set status(value: string) {
    this.props.status = value;
  }

  get status(): string {
    return this.props.status;
  }

  get created_at(): Date {
    return this.props.created_at;
  }
}
