import {
  PaginationOutputDto,
  PaginationOutputMapper,
  SearchInputDto,
} from "#seedwork/application";
import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { UserRepository } from "#user/domain";
import { UserOutput } from "../dtos";
import UserOutputMapper from "../mappers/user-output.mapper";

export namespace ListUserUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(input);
      const searchResult = await this.userRepository.search(params);
      return this.toOutPut(searchResult);
    }
    private toOutPut(searchResult: UserRepository.UserSearchResult): Output {
      return {
        items: searchResult.items.map((item) =>
          UserOutputMapper.toOutput(item)
        ),
        ...PaginationOutputMapper.toPaginationOutput(searchResult),
      };
    }
  }

  export type Input = SearchInputDto;

  export type Output = PaginationOutputDto<UserOutput>;
}

export default ListUserUseCase;
