import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "#seedwork/domain/repositories/index";
import { Deck } from "../entities";

export namespace DeckRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class DeckSearchResult extends DefaultSearchResult<Deck, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Deck,
      Filter,
      SearchParams,
      DeckSearchResult
    > {}
}

export default DeckRepository;
