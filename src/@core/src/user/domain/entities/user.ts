import { Entity, UniqueEntityId } from "#seedwork/domain";

export type UserProps = {
  email: string;
  email_confirmation: boolean;
  password: string;
  name: string;
  created_at: Date;
};

export class User extends Entity<UserProps> {
  constructor(public readonly props: UserProps, id?: UniqueEntityId) {
    super(props, id);
    this.props.email_confirmation = false;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get name(): string {
    return this.props.name;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  confirm(): void {
    this.email_confirmation = true;
  }

  get email_confirmation(): boolean {
    return this.props.email_confirmation;
  }

  private set email_confirmation(value: boolean) {
    this.props.email_confirmation = value ?? false;
  }
}
