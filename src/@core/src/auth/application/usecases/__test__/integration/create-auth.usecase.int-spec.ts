import { JWTAdapter } from "#auth/infra";
import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { User } from "#user/domain";

import { UserPrismaRepository } from "#user/infra";

import { CreateAuthUseCase } from "../../create-auth.usecase";

describe("create user use case integration test", () => {
  let repository: UserPrismaRepository;
  let useCase: CreateAuthUseCase.UseCase;
  let hasherCompare = new BcryptAdapter.CompareAdapter();
  let jwtAdapter = new JWTAdapter(process.env.JWT_SECRET);

  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
    useCase = new CreateAuthUseCase.UseCase(
      repository,
      hasherCompare,
      jwtAdapter
    );
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should create a user", async () => {
    const entity = new User(new BcryptAdapter.HasherAdapter(12), {
      email: "some@email.com",
      name: "some name",
      password: "some password",
      created_at: new Date(),
    });
    await entity.setPassword(entity.password);
    await repository.insert(entity);
    const spyRepository = jest.spyOn(repository, "findByEmail");
    let output = await useCase.execute({
      email: "some@email.com",
      password: "some password",
    });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      user: {
        id: entity.id,
        email: "some@email.com",
        name: "some name",
        email_confirmation: false,
      },
      token: output.token,
    });
  });
});
