import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { User } from "#user/domain";
import { AuthPrismaRepository } from "./auth-prisma";
import { v4 as uuid } from "uuid";
describe("auth prisma unit test", () => {
  let repository: AuthPrismaRepository;

  beforeEach(async () => {
    repository = new AuthPrismaRepository(prismaClient);
    await prismaClient.auth.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.auth.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("Should be inserts a auth", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);
    let user = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await user.setPassword("some name");
    await prismaClient.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_confirmation: user.email_confirmation,
        password: user.password,
      },
    });
    const input = {
      id: uuid(),
      user_id: user.id,
      token: "some token",
    };
    await repository.insert(input);
    let model = await prismaClient.auth.findUnique({
      where: {
        user_id: user.id,
      },
    });

    expect(input).toStrictEqual({
      id: model.id,
      user_id: model.user_id,
      token: model.token,
    });
  });

  it("should find a auth the a user", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);
    let user = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await user.setPassword("some name");
    await prismaClient.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_confirmation: user.email_confirmation,
        password: user.password,
      },
    });
    const input = {
      id: uuid(),
      user_id: user.id,
      token: "some token",
    };
    await repository.insert(input);
    const model = await repository.findById(input.user_id);
    expect(model).toMatchObject({
      id: input.id,
      user: {
        id: input.user_id,
        email: user.email,
        name: user.name,
      },
      token: input.token,
    });
  });
});
