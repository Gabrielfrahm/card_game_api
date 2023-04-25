import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  ListUserUseCase,
  UpdateUserUseCase,
} from 'core/user/application';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserPresenter } from './presenter/user.presenter';
import { SearchUserDto } from './dtos/search-user.dto';
import { UserCollectionPresenter } from './presenter/user.presenter';
import { UpdateUserDto } from './dtos/update-user';
import { RedisCacheInterceptor } from './Interceptors/redis-cache.interceptor';

@Controller('users')
@UseInterceptors(RedisCacheInterceptor)
export class UsersController {
  @Inject(CreateUserUseCase.UseCase)
  private createUseCase: CreateUserUseCase.UseCase;

  @Inject(ListUserUseCase.UseCase)
  private listUserUseCase: ListUserUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase;

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase;

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const output = await this.createUseCase.execute(createUserDto);
    return new UserPresenter(output);
  }

  @HttpCode(204)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
  }

  @Get()
  @HttpCode(200)
  async search(@Query() searchUserDto: SearchUserDto) {
    const output = await this.listUserUseCase.execute(searchUserDto);
    const { data, meta } = new UserCollectionPresenter(output);
    return {
      data,
      meta,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return new UserPresenter(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
