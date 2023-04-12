import {
  InMemoryRepository,
  InMemorySearchableRepository,
} from "#seedwork/domain";
import { User, UserRepository } from "#user/domain";

export class UserInMemoryRepository
  extends InMemorySearchableRepository<User>
  implements UserRepository.Repository
{
  sortableFields: string[] = ["email", "name", "created_at"];

  protected async applyFilter(
    items: User[],
    filter: UserRepository.Filter,
    field: string
  ): Promise<User[]> {
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
    items: User[],
    sort: string | null,
    sort_dir: string | null
  ): Promise<User[]> {
    if (!sort) {
      return super.applySort(items, "created_at", "desc");
    }
    return super.applySort(items, sort, sort_dir);
  }
}

export default UserInMemoryRepository;
