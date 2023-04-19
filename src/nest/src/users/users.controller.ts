import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserUseCase, GetUserUseCase } from 'core/user/application';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserPresenter } from './presenter/user.presenter';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase.UseCase)
  private createUseCase: CreateUserUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const output = await this.createUseCase.execute(createUserDto);
    return new UserPresenter(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return new UserPresenter(output);
  }
}
