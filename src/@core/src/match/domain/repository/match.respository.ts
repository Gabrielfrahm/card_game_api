import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "#seedwork/domain/repositories/index";
import { Match } from "../entities/match";

export namespace MatchRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class MatchSearchResult extends DefaultSearchResult<Match, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Match,
      Filter,
      SearchParams,
      MatchSearchResult
    > {}
}

export default MatchRepository;
