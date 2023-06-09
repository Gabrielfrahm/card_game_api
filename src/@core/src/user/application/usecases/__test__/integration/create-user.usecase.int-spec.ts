import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { UserPrismaRepository } from "#user/infra";
import CreateUserUseCase from "../../create-user.usecase";

describe("create user use case integration test", () => {
  let repository: UserPrismaRepository;
  let useCase: CreateUserUseCase.UseCase;
  let hasher = new BcryptAdapter.HasherAdapter(12);

  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
    useCase = new CreateUserUseCase.UseCase(repository, hasher);
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should create a user", async () => {
    const spyRepository = jest.spyOn(repository, "insert");
    let output = await useCase.execute({
      email: "some@email.com",
      name: "some name",
      password: "some password",
      created_at: new Date(),
    });
    const entity = await repository.findById(output.id);
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      email: entity.email,
      name: entity.name,
      email_confirmation: entity.email_confirmation,
      password: entity.password,
      created_at: entity.created_at,
    });
  });
});
