import { JWTAdapter } from "#auth/infra";
import { AuthPrismaRepository } from "#auth/infra";
import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { User } from "#user/domain";

import { UserPrismaRepository } from "#user/infra";

import { CreateAuthUseCase } from "../../create-auth.usecase";

describe("auth user use case integration test", () => {
  let repository: UserPrismaRepository;
  let authRepository: AuthPrismaRepository;
  let useCase: CreateAuthUseCase.UseCase;
  let hasherCompare = new BcryptAdapter.CompareAdapter();
  let jwtAdapter = new JWTAdapter(process.env.JWT_SECRET);

  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
    authRepository = new AuthPrismaRepository(prismaClient);
    useCase = new CreateAuthUseCase.UseCase(
      repository,
      authRepository,
      hasherCompare,
      jwtAdapter
    );

    await prismaClient.auth.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.auth.deleteMany({ where: {} });

    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should auth a user", async () => {
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
