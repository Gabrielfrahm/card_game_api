import { NotFoundError } from "#seedwork/domain";
import { User } from "#user/domain";
import { BcryptAdapter, UserInMemoryRepository } from "#user/infra";
import UpdateUserUseCase from "../../update-user.usecase";

describe("get user use case unit test", () => {
  let repository: UserInMemoryRepository;
  let useCase: UpdateUserUseCase.UseCase;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new UpdateUserUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID fake id`)
    );
  });

  it("should get a user", async () => {
    const hasher = new BcryptAdapter(12);
    const entity = new User(hasher, {
      email: "some@email.com",
      name: "some name",
      password: "some password",
      created_at: new Date(),
    });
    repository.items = [entity];
    const spyRepository = jest.spyOn(repository, "findById");
    let output = await useCase.execute({ id: entity.id });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      email: "some@email.com",
      name: "some name",
      email_confirmation: false,
      password: "some password",
      created_at: repository.items[0].created_at,
    });
  });
});
