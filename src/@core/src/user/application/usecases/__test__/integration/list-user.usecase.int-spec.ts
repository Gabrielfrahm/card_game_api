import { UserPrismaRepository } from "#user/infra";
import { PrismaClient } from "@prisma/client";

import ListUserUseCase from "../../list-user.usecase";
import { prismaClient } from "#seedwork/infra";

describe("list user use case integration test", () => {
  let repository: UserPrismaRepository;
  let useCase: ListUserUseCase.UseCase;

  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
    useCase = new ListUserUseCase.UseCase(repository);
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    await prismaClient.user.create({
      data: {
        email: "test@teste.com",
        email_confirmation: false,
        name: "some name",
        password: "some password",
      },
    });
    await prismaClient.user.create({
      data: {
        email: "teste@teste.com",
        email_confirmation: false,
        name: "some name",
        password: "some password",
      },
    });

    const models = await prismaClient.user.findMany({
      select: {
        id: true,
        email: true,
        email_confirmation: true,
        name: true,
        password: true,
        created_at: true,
      },
    });
    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [...models].reverse().map((item) => item),
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 10,
    });
  });

  it("should return output using pagination, sort and filter", async () => {
    const arrange = [
      {
        email: "test@teste.com",
        email_confirmation: false,
        name: "a",
        password: "some password",
      },
      {
        email: "test2@teste.com",
        email_confirmation: false,
        name: "AAA",
        password: "some password",
      },
      {
        email: "test3@teste.com",
        email_confirmation: false,
        name: "AaA",
        password: "some password",
      },
      {
        email: "test4@teste.com",
        email_confirmation: false,
        name: "b",
        password: "some password",
      },
      {
        email: "test5@teste.com",
        email_confirmation: false,
        name: "c",
        password: "some password",
      },
    ];

    for (let user of arrange) {
      await prismaClient.user.create({
        data: user,
      });
    }
    const models = await prismaClient.user.findMany({
      select: {
        id: true,
        email: true,
        email_confirmation: true,
        name: true,
        password: true,
        created_at: true,
      },
    });
    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
      column: "name",
    });

    expect(output).toStrictEqual({
      items: [models[2], models[1]].reverse(),
      total: 2,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
      column: "name",
    });

    expect(output).toStrictEqual({
      items: [models[0]].reverse(),
      total: 1,
      current_page: 2,
      per_page: 2,
      last_page: 1,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
      column: "name",
    });
    expect(output).toStrictEqual({
      items: [models[2], models[0]].reverse(),
      total: 2,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });
});
