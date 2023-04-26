import { UniqueEntityId } from "#seedwork/domain";
import { PrismaClient } from "@prisma/client";
import { UserModelMapper } from "../user-model.mapper";
import { User } from "#user/domain";

import { BcryptAdapter, prismaClient } from "#seedwork/infra";

describe("User Model Mapper  unit test", () => {
  beforeEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should convert a user model to a user entity", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);
    const created_at = new Date();
    const user = {
      email: "test@test.com",
      email_confirmation: false,
      name: "some name",
      password: "some password",
      created_at,
    };

    const model = await prismaClient.user.create({
      data: user,
      select: {
        id: true,
        email: true,
        email_confirmation: true,
        name: true,
        password: true,
        created_at: true,
      },
    });

    const entity = UserModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new User(hasher, user, new UniqueEntityId(entity.id)).toJSON()
    );
  });
});
