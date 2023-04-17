import { prismaClient } from "#seedwork/infra";
import { UserPrismaRepository } from "#user/infra";

import DeleteUserUseCase from "../../delete-user.usecase";

describe("delete user use case integration test", () => {
  let repository: UserPrismaRepository;
  let useCase: DeleteUserUseCase.UseCase;

  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
    useCase = new DeleteUserUseCase.UseCase(repository);
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should get a user", async () => {
    const model = await prismaClient.user.create({
      data: {
        email: "some@email.com",
        email_confirmation: false,
        name: "some name",
        password: "some password",
        created_at: new Date(),
      },
    });

    await useCase.execute({ id: model.id });
    const response = await prismaClient.user.findUnique({
      where: {
        id: model.id,
      },
    });
    expect(response).toBeNull();
  });
});
