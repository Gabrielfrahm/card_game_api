import { UserInMemoryRepository } from "#user/infra";
import CreateUserUseCase from "../../create-user.usecase";

describe("create user use case unit test", () => {
  let repository: UserInMemoryRepository;
  let useCase: CreateUserUseCase.UseCase;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new CreateUserUseCase.UseCase(repository);
  });

  it("should create a user", async () => {
    const spyRepository = jest.spyOn(repository, "insert");
    let output = await useCase.execute({
      email: "some@email.com",
      name: "some name",
      password: "some password",
      created_at: new Date(),
    });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      email: "some@email.com",
      email_confirmation: false,
      name: "some name",
      password: repository.items[0].password,
      created_at: repository.items[0].created_at,
    });

    output = await useCase.execute({
      email: "some@email.com",
      name: "another name",
      password: "some password",
      created_at: new Date(),
    });
    expect(spyRepository).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      email: "some@email.com",
      name: "another name",
      email_confirmation: false,
      password: repository.items[1].password,
      created_at: repository.items[1].created_at,
    });
  });
});
