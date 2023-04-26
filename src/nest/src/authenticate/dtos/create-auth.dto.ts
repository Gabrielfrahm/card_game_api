import { CreateAuthUseCase } from 'core/auth/application';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto implements CreateAuthUseCase.Input {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
