import ClassValidatorFields from "#seedwork/domain/validator/class-validator";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import { UserProps } from "../entities/user";

export class UserRules {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  email_confirmation: boolean;

  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDate()
  created_at: Date;

  constructor(data: UserProps) {
    Object.assign(this, data);
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserRules): boolean {
    return super.validate(new UserRules(data ?? ({} as any)));
  }
}

export class UserVAlidatorFactory {
  static create() {
    return new UserValidator();
  }
}

export default UserVAlidatorFactory;
