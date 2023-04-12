import {
  Entity,
  EntityValidationError,
  UniqueEntityId,
} from "#seedwork/domain";
import { Hasher } from "#seedwork/infra";
import UserValidatorFactory from "../validator/create/user.validator";
import UserUpdateValidatorFactory from "../validator/update/user-update.validator";

export type UserProps = {
  email: string;
  email_confirmation?: boolean;
  password: string;
  name: string;
  created_at: Date;
};

export type UpdateUser = {
  email?: string;
  password?: string;
  name?: string;
};

export class User extends Entity<UserProps> {
  constructor(
    private readonly hasher: Hasher,
    public readonly props: UserProps,
    id?: UniqueEntityId
  ) {
    User.validate(props);
    super(props, id);
    this.props.email_confirmation = this.email_confirmation ?? false;
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  update({ email, name, password }: UpdateUser): void {
    const updateValidator = UserUpdateValidatorFactory.create();
    const isValid = updateValidator.validate({ email, name, password });
    if (!isValid) {
      throw new EntityValidationError(updateValidator.errors);
    }
    if (email) {
      this.props.email = email;
    }
    if (name) {
      this.props.name = name;
    }
    if (password) {
      this.props.password = password;
    }
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  async setPassword(password: string) {
    const hashedPassword = await this.hasher.hash(password);
    this.props.password = hashedPassword;
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
    this.props.email_confirmation = value;
  }
}
