import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase } from 'core/user/application';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserPresenter } from './presenter/user.presenter';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase.UseCase)
  private createUseCase: CreateUserUseCase.UseCase;

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const output = await this.createUseCase.execute(createUserDto);
    return new UserPresenter(output);
  }
}
