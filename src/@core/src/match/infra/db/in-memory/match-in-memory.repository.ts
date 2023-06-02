import { Match, MatchRepository } from "#match/domain";
import { InMemorySearchableRepository } from "#seedwork/domain";

export class MatchInMemoryRepository
  extends InMemorySearchableRepository<Match>
  implements MatchRepository.Repository
{
  sortableFields: string[] = ["created_at"];

  protected async applyFilter(
    items: Match[],
    filter: MatchRepository.Filter,
    field: string
  ): Promise<Match[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      return item.props[field]
        .toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase());
    });
  }

  protected async applySort(
    items: Match[],
    sort: string | null,
    sort_dir: string | null
  ): Promise<Match[]> {
    if (!sort) {
      return super.applySort(items, "created_at", "desc");
    }
    return super.applySort(items, sort, sort_dir);
  }
}

export default MatchInMemoryRepository;
