import { UserPrismaRepository } from "#user/infra";
import { PrismaClient } from "@prisma/client";

import { NotFoundError } from "#seedwork/domain";
import UpdateUserUseCase from "../../update-user.usecase";
import { prismaClient } from "#seedwork/infra";

describe("update user use case integration test", () => {
  let repository: UserPrismaRepository;
  let useCase: UpdateUserUseCase.UseCase;

  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
    useCase = new UpdateUserUseCase.UseCase(repository);
    await prismaClient.user.deleteMany({ where: {} });
  });
  afterEach;
  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });
  it("should throws error when entity not found", async () => {
    await expect(useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
  });

  it("should update a user", async () => {
    const model = await prismaClient.user.create({
      data: {
        email: "some@email.com",
        email_confirmation: false,
        name: "some name",
        password: "some password",
        created_at: new Date(),
      },
    });

    let output = await useCase.execute({
      id: model.id,
      email_confirmation: true,
    });
    let response = await prismaClient.user.update({
      where: {
        id: model.id,
      },
      data: {
        email_confirmation: true,
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

    output = await useCase.execute({
      id: model.id,
      name: "name updated",
    });

    response = await prismaClient.user.update({
      data: {
        name: "name updated",
      },
      where: {
        id: model.id,
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
