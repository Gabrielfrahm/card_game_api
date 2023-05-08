import { DeckRepository } from "#deck/domain";
import {
  PaginationOutputDto,
  PaginationOutputMapper,
  SearchInputDto,
} from "#seedwork/application";
import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { DeckOutput } from "../dtos";
import DeckOutputMapper from "../mappers/deck-output.mapper";

export namespace ListDeckUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private DeckRepository: DeckRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const { searchInputDto, user_id } = input;
      const params = new DeckRepository.SearchParams(searchInputDto);
      const searchResult = await this.DeckRepository.search(params, user_id);
      return this.toOutPut(searchResult);
    }
    private toOutPut(searchResult: DeckRepository.DeckSearchResult): Output {
      return {
        items: searchResult.items.map((item) =>
          DeckOutputMapper.toOutput(item)
        ),
        ...PaginationOutputMapper.toPaginationOutput(searchResult),
      };
    }
  }

  export type Input = { searchInputDto: SearchInputDto; user_id?: string };

  export type Output = PaginationOutputDto<DeckOutput>;
}

export default ListDeckUseCase;
