import { CreateUserUseCase } from 'core/user/application';

export class CreateUserDto implements CreateUserUseCase.Input {
  email: string;
  name: string;
  password: string;
  created_at: Date;
}
