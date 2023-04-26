import { NotFoundError } from "#seedwork/domain";
import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";
import { UserInMemoryRepository } from "#user/infra";
import DeleteUserUseCase from "../../delete-user.usecase";

describe("delete user use case unit test", () => {
  let repository: UserInMemoryRepository;
  let useCase: DeleteUserUseCase.UseCase;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new DeleteUserUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID fake id`)
    );
  });

  it("should delete a user", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);
    const entity = new User(hasher, {
      email: "some@email.com",
      name: "some name",
      password: "some password",
      created_at: new Date(),
    });
    repository.items = [entity];
    const spyRepository = jest.spyOn(repository, "delete");
    await useCase.execute({ id: entity.id });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(0);
  });
});
