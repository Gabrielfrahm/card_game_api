import { UserPrismaRepository } from "#user/infra";
import { PrismaClient } from "@prisma/client";
import CreateUserUseCase from "../../create-user.usecase";
import DeleteUserUseCase from "../../delete-user.usecase";

describe("delete user use case integration test", () => {
  let prismaClient = new PrismaClient();
  let repository: UserPrismaRepository;
  let useCase: DeleteUserUseCase.UseCase;

  beforeEach(() => {
    repository = new UserPrismaRepository(prismaClient);
    useCase = new DeleteUserUseCase.UseCase(repository);
  });
  afterEach(() => prismaClient.user.deleteMany());

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
