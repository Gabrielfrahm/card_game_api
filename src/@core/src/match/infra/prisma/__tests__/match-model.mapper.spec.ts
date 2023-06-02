import { Match } from "#match/domain";
import { UniqueEntityId } from "#seedwork/domain";

import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { MatchModelMapper } from "../match-model.mapper";

describe("Match Model Mapper unit test", () => {
  beforeEach(async () => {
    await prismaClient.match.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.match.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should convert a match model to a user entity", async () => {
    const created_at = new Date();
    const user = {
      email: "test@test.com",
      email_confirmation: false,
      name: "some name",
      password: "some password",
      created_at,
    };

    const userModel = await prismaClient.user.create({
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

    const match = {
      host_id: userModel.id,
      status: "awaiting_players",
      created_at,
    };
    const model = await prismaClient.match.create({
      data: match,
      select: {
        id: true,
        host_id: true,
        participant_id: true,
        status: true,
        created_at: true,
      },
    });

    const entity = MatchModelMapper.toEntity(model);
    const expected = new Match(match, new UniqueEntityId(entity.id)).toJSON();
    expect(entity.toJSON()).toStrictEqual({
      ...expected,
      participant_id: null,
    });
  });
});
