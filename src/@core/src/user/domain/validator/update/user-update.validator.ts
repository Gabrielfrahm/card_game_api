import ClassValidatorFields from "#seedwork/domain/validator/class-validator";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { UserProps } from "../../entities/user";

export class UserUpdateRules {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  constructor(data: UserProps) {
    Object.assign(this, data);
  }
}

export class UserUpdateValidator extends ClassValidatorFields<UserUpdateRules> {
  validate(data: UserUpdateRules): boolean {
    return super.validate(new UserUpdateRules(data ?? ({} as any)));
  }
}

export class UserUpdateValidatorFactory {
  static create() {
    return new UserUpdateValidator();
  }
}

export default UserUpdateValidatorFactory;
