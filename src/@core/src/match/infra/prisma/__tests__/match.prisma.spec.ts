import { Match } from "#match/domain";
import { prismaClient } from "#seedwork/infra";
import { MatchPrismaRepository } from "../match.prisma";

describe("match prisma unit test", () => {
  let repository: MatchPrismaRepository;

  beforeEach(async () => {
    repository = new MatchPrismaRepository(prismaClient);
    await prismaClient.match.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.match.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("Should be inserts a match", async () => {
    await prismaClient.user.create({
      data: {
        id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
        email: "dale@dale.com",
        email_confirmation: false,
        name: "user 1",
        password: "123",
      },
    });
    await prismaClient.user.create({
      data: {
        id: "a6d5b259-4ef0-4132-bde7-8bb7e12d0ad6",
        email: "dale2@dale.com",
        email_confirmation: false,
        name: "user 2",
        password: "123",
      },
    });

    const match = new Match({
      host_id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
      participant_id: "a6d5b259-4ef0-4132-bde7-8bb7e12d0ad6",
      status: "pending",
    });

    await repository.insert(match);

    let model = await prismaClient.match.findUnique({
      where: {
        id: match.id,
      },
    });

    expect(match.toJSON()).toStrictEqual({
      id: model.id,
      host_id: model.host_id,
      participant_id: model.participant_id,
      status: model.status,
      created_at: model.created_at,
    });
  });
});
