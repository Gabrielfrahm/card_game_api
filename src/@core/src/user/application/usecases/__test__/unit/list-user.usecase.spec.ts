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
  });

  // it("should return output sorted by created_at when input param is empty", async () => {
  //   const items = [
  //     new Category({ name: "test 1" }),
  //     new Category({
  //       name: "test 2",
  //       created_at: new Date(new Date().getTime() + 100),
  //     }),
  //   ];
  //   repository.items = items;

  //   const output = await useCase.execute({});
  //   expect(output).toStrictEqual({
  //     items: [...items].reverse().map((i) => i.toJSON()),
  //     total: 2,
  //     current_page: 1,
  //     per_page: 15,
  //     last_page: 1,
  //   });
  // });
});
