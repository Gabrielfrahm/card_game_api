import { Deck, DeckRepository } from "#deck/domain";
import { InMemorySearchableRepository } from "#seedwork/domain";

export class DeckInMemoryRepository
  extends InMemorySearchableRepository<Deck>
  implements DeckRepository.Repository
{
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: Deck[],
    filter: DeckRepository.Filter,
    field: string
  ): Promise<Deck[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      return item.props[field]
        .toString()
        .toLocaleLowerCase()
        .includes(filter.toString().toLocaleLowerCase());
    });
  }

  protected async applySort(
    items: Deck[],
    sort: string | null,
    sort_dir: string | null
  ): Promise<Deck[]> {
    if (!sort) {
      return super.applySort(items, "created_at", "desc");
    }
    return super.applySort(items, sort, sort_dir);
  }
}

export default DeckInMemoryRepository;
