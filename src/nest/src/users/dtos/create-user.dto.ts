import { CreateUserUseCase } from 'core/user/application';
import { IsNotEmpty } from 'class-validator';
export class CreateUserDto implements CreateUserUseCase.Input {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;
  created_at: Date;
}
