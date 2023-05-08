import { Deck, DeckRepository } from "#deck/domain";
import { DeckInMemoryRepository } from "#deck/infra";
import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";
import ListDeckUseCase from "../../list-deck.usecase";

describe("list deck  use case unit test", () => {
  let repository: DeckInMemoryRepository;
  let useCase: ListDeckUseCase.UseCase;

  beforeEach(() => {
    repository = new DeckInMemoryRepository();
    useCase = new ListDeckUseCase.UseCase(repository);
  });

  test("toOutput method", () => {
    let result = new DeckRepository.DeckSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      column: null,
    });
    let output = useCase["toOutPut"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = new Deck({
      name: "some name 1",
      user: new User(new BcryptAdapter.HasherAdapter(12), {
        email: "dale@dale.com",
        name: "user",
        password: "123",
      }),
    });
    result = new DeckRepository.DeckSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      column: null,
    });
    output = useCase["toOutPut"](result);
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it("should return output using pagination, sort and filter", async () => {
    const user = new User(new BcryptAdapter.HasherAdapter(12), {
      email: "dale@dale.com",
      name: "user",
      password: "123",
    });
    const items = [
      new Deck({
        name: "a",
        user: user,
        created_at: new Date(),
      }),
      new Deck({
        name: "AAA",
        user: user,
        created_at: new Date(),
      }),
      new Deck({
        name: "AaA",
        user: user,
        created_at: new Date(),
      }),
      new Deck({
        name: "b",
        user: user,
        created_at: new Date(),
      }),
      new Deck({
        name: "c",
        user: user,
        created_at: new Date(),
      }),
    ];
    repository.items = items;
    let searchInputDto = {
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
      column: "name",
    };
    let output = await useCase.execute({
      searchInputDto,
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
    searchInputDto = {
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
      column: "name",
    };
    output = await useCase.execute({
      searchInputDto,
    });

    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      searchInputDto: {
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "desc" as any,
        filter: "a",
        column: "name",
      },
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
