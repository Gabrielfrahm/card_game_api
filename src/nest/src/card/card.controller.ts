import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateCardUseCase,
  GetCardUseCase,
  ListCardUseCase,
} from 'core/card/application';
import { CreateCardDto } from './dtos/create-card.dto';
import { SearchCardDto } from './dtos/search-card.dto';

@Controller('cards')
export class CardController {
  @Inject(CreateCardUseCase.UseCase)
  private createUseCase: CreateCardUseCase.UseCase;

  @Inject(GetCardUseCase.UseCase)
  private getCardUseCase: GetCardUseCase.UseCase;

  @Inject(ListCardUseCase.UseCase)
  private listCardUseCase: ListCardUseCase.UseCase;

  @Post()
  @HttpCode(201)
  async create(@Body() createCardDto: CreateCardDto) {
    const output = await this.createUseCase.execute(createCardDto);
    return output;
  }

  @Get()
  @HttpCode(200)
  async search(@Query() searchCardDto: SearchCardDto) {
    const output = await this.listCardUseCase.execute(searchCardDto);
    return output;
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    const output = await this.getCardUseCase.execute({ id });
    return output;
  }
}
