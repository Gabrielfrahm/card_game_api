import { CardRepository } from "#card/domain";
import {
  PaginationOutputDto,
  PaginationOutputMapper,
  SearchInputDto,
} from "#seedwork/application";
import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { CardOutput } from "../dtos";
import CardOutputMapper from "../mappers/card-output.mapper";

export namespace ListCardUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cardRepository: CardRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const params = new CardRepository.SearchParams(input);
      const searchResult = await this.cardRepository.search(params);
      return this.toOutPut(searchResult);
    }
    private toOutPut(searchResult: CardRepository.CardSearchResult): Output {
      return {
        items: searchResult.items.map((item) =>
          CardOutputMapper.toOutput(item)
        ),
        ...PaginationOutputMapper.toPaginationOutput(searchResult),
      };
    }
  }

  export type Input = SearchInputDto;

  export type Output = PaginationOutputDto<CardOutput>;
}

export default ListCardUseCase;
