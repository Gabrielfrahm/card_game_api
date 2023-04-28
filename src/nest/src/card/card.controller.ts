import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardUseCase,
  ListCardUseCase,
} from 'core/card/application';
import { CreateCardDto } from './dtos/create-card.dto';
import { SearchCardDto } from './dtos/search-card.dto';
import {
  CardCollectionPresenter,
  CardPresenter,
} from './presenter/card.presenter';

@Controller('cards')
export class CardController {
  @Inject(CreateCardUseCase.UseCase)
  private createUseCase: CreateCardUseCase.UseCase;

  @Inject(GetCardUseCase.UseCase)
  private getCardUseCase: GetCardUseCase.UseCase;

  @Inject(ListCardUseCase.UseCase)
  private listCardUseCase: ListCardUseCase.UseCase;

  @Inject(DeleteCardUseCase.UseCase)
  private deleteCardUseCase: DeleteCardUseCase.UseCase;

  @Post()
  @HttpCode(201)
  async create(@Body() createCardDto: CreateCardDto) {
    const output = await this.createUseCase.execute(createCardDto);
    return new CardPresenter(output);
  }

  @Get()
  @HttpCode(200)
  async search(@Query() searchCardDto: SearchCardDto) {
    const output = await this.listCardUseCase.execute(searchCardDto);
    const { data, meta } = new CardCollectionPresenter(output);
    return {
      data,
      meta,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    const output = await this.getCardUseCase.execute({ id });
    return new CardPresenter(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteCardUseCase.execute({ id });
  }
}
