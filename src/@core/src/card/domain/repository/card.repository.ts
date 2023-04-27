import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "#seedwork/domain/repositories/index";
import { Card } from "../entities";

export namespace CardRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class CardSearchResult extends DefaultSearchResult<Card, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Card,
      Filter,
      SearchParams,
      CardSearchResult
    > {}
}

export default CardRepository;
