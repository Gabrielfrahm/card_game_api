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
  CreateDeckUseCase,
  DeleteDeckUseCase,
  GetDeckUseCase,
  ListDeckUseCase,
  UpdateDeckUseCase,
} from 'core/deck/application';
import { CreateDeckDto } from './dtos/create-deck.dto';
import {
  DeckCollectionPresenter,
  DeckPresenter,
} from './presenter/deck.presenter';
import { SearchDeckDto } from './dtos/search-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';
import { RedisCacheInterceptor } from './Interceptors/redis-cache.interceptor';

@Controller('decks')
@UseInterceptors(RedisCacheInterceptor)
export class DecksController {
  @Inject(CreateDeckUseCase.UseCase)
  private createUseCase: CreateDeckUseCase.UseCase;

  @Inject(GetDeckUseCase.UseCase)
  private getUseCase: GetDeckUseCase.UseCase;

  @Inject(UpdateDeckUseCase.UseCase)
  private updateDeckUseCase: UpdateDeckUseCase.UseCase;

  @Inject(ListDeckUseCase.UseCase)
  private listUseCase: ListDeckUseCase.UseCase;

  @Inject(DeleteDeckUseCase.UseCase)
  private deleteDeckUseCase: DeleteDeckUseCase.UseCase;

  @Post()
  @HttpCode(201)
  async create(@Body() createDeckDto: CreateDeckDto) {
    const output = await this.createUseCase.execute(createDeckDto);
    return new DeckPresenter(output);
  }

  @Get(':userId')
  @HttpCode(200)
  async search(
    @Param('userId') user_id: string,
    @Query() searchDeckDto: SearchDeckDto,
  ) {
    const output = await this.listUseCase.execute({
      searchInputDto: searchDeckDto,
      user_id: user_id,
    });
    const { data, meta } = new DeckCollectionPresenter(output);
    return {
      data,
      meta,
    };
  }

  @Get('one/:id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    const output = await this.getUseCase.execute({ id: id });
    return new DeckPresenter(output);
  }

  @HttpCode(204)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return await this.updateDeckUseCase.execute({
      id: id,
      ...updateDeckDto,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteDeckUseCase.execute({ id });
  }
}
