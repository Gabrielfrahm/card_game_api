import { SearchResult } from "../../../@seedwork/domain/repository/repository-contracts";
import { PaginationOutputDto } from "../dtos";

export class PaginationOutputMapper {
  static toPaginationOutput(
    result: SearchResult<any>
  ): Omit<PaginationOutputDto, "items"> {
    return {
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    };
  }
}

export default PaginationOutputMapper;
