import { User, UserRepository } from "#user/domain";
import { BcryptAdapter, UserInMemoryRepository } from "#user/infra";
import ListUserUseCase from "../../list-user.usecase";

describe("list categories use case unit test", () => {
  let repository: UserInMemoryRepository;
  let useCase: ListUserUseCase.UseCase;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new ListUserUseCase.UseCase(repository);
  });

  test("toOutput method", () => {
    let result = new UserRepository.UserSearchResult({
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

    const hasher = new BcryptAdapter(12);
    const entity = new User(hasher, {
      email: "some@email.com",
      name: "some name",
      password: "123456",
      created_at: new Date(),
    });
    result = new UserRepository.UserSearchResult({
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

  it("should return output sorted by created_at when input param is empty", async () => {
    const hasher = new BcryptAdapter(12);

    const items = [
      new User(hasher, {
        email: "some@email.com",
        name: "some name",
        password: "123456",
        created_at: new Date(),
      }),
      new User(hasher, {
        email: "some@email.com",
        name: "some name",
        password: "123456",
        created_at: new Date(),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [...items].reverse().map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 10,
      last_page: 1,
    });
  });

  it("should return output using pagination, sort and filter", async () => {
    const hasher = new BcryptAdapter(12);
    const items = [
      new User(hasher, {
        email: "some@email.com",
        name: "a",
        password: "123456",
        created_at: new Date(),
      }),
      new User(hasher, {
        email: "some@email.com",
        name: "AAA",
        password: "123456",
        created_at: new Date(),
      }),
      new User(hasher, {
        email: "some@email.com",
        name: "AaA",
        password: "123456",
        created_at: new Date(),
      }),
      new User(hasher, {
        email: "some@email.com",
        name: "b",
        password: "123456",
        created_at: new Date(),
      }),
      new User(hasher, {
        email: "some@email.com",
        name: "c",
        password: "123456",
        created_at: new Date(),
      }),
    ];
    repository.items = items;
    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
      column: "name",
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
      column: "name",
    });

    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
      column: "name",
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
