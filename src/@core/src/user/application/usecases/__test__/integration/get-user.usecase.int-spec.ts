import { UserPrismaRepository } from "#user/infra";
import { PrismaClient } from "@prisma/client";

import GetUserUseCase from "../../get-user.usecase";
import { NotFoundError } from "#seedwork/domain";
import { prismaClient } from "#seedwork/infra";

describe("get user use case integration test", () => {
  let repository: UserPrismaRepository;
  let useCase: GetUserUseCase.UseCase;

  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
    useCase = new GetUserUseCase.UseCase(repository);
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should throws error when entity not found", async () => {
    await expect(useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
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

    const output = await useCase.execute({ id: model.id });
    const response = await prismaClient.user.findUnique({
      where: {
        id: model.id,
      },
      select: {
        id: true,
        email: true,
        email_confirmation: true,
        name: true,
        password: true,
        created_at: true,
      },
    });
    expect(output).toStrictEqual({
      id: response.id,
      email: response.email,
      email_confirmation: response.email_confirmation,
      name: response.name,
      password: response.password,
      created_at: response.created_at,
    });
  });
});
