import { Card, CardRepository } from "#card/domain";
import { InMemorySearchableRepository } from "#seedwork/domain";

export class CardInMemoryRepository
  extends InMemorySearchableRepository<Card>
  implements CardRepository.Repository
{
  sortableFields: string[] = [
    "name",
    "number",
    "category",
    "description",
    "atk",
    "def",
    "effect",
    "main_card",
    "created_at",
  ];

  protected async applyFilter(
    items: Card[],
    filter: CardRepository.Filter,
    field: string
  ): Promise<Card[]> {
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
    items: Card[],
    sort: string | null,
    sort_dir: string | null
  ): Promise<Card[]> {
    if (!sort) {
      return super.applySort(items, "created_at", "desc");
    }
    return super.applySort(items, sort, sort_dir);
  }
}

export default CardInMemoryRepository;
