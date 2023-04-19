import { CreateUserUseCase } from 'core/user/application';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto implements CreateUserUseCase.Input {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  created_at: Date;
}
