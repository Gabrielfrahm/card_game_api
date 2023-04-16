import { UserPrismaRepository } from "#user/infra";
import { PrismaClient } from "@prisma/client";

import DeleteUserUseCase from "../../delete-user.usecase";
import GetUserUseCase from "../../get-user.usecase";
import { NotFoundError } from "#seedwork/domain";
import ListUserUseCase from "../../list-user.usecase";

describe("get user use case integration test", () => {
  let prismaClient = new PrismaClient();
  let repository: UserPrismaRepository;
  let useCase: ListUserUseCase.UseCase;

  beforeEach(() => {
    repository = new UserPrismaRepository(prismaClient);
    useCase = new ListUserUseCase.UseCase(repository);
  });
  afterEach(() => prismaClient.user.deleteMany());

  it("should return output sorted by created_at when input param is empty", async () => {
    await prismaClient.user.create({
      data: {},
    });
  });
});
