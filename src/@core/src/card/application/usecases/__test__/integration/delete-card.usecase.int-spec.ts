import { CardPrismaRepository } from "#card/infra/db/prisma/card-prisma";
import { prismaClient } from "#seedwork/infra";
import DeleteCardUseCase from "../../delete-card.usecase";

describe("delete card use case integration test", () => {
  let repository: CardPrismaRepository;
  let useCase: DeleteCardUseCase.UseCase;

  beforeEach(async () => {
    repository = new CardPrismaRepository(prismaClient);
    useCase = new DeleteCardUseCase.UseCase(repository);
    await prismaClient.card.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.card.deleteMany({ where: {} });
  });

  it("should get a card", async () => {
    const model = await prismaClient.card.create({
      data: {
        name: "some name 1",
        number: 1,
        category: "monster 1",
        image_url: "some image 1",
        description: "some description 1",
        atk: "atk 1",
        def: "def 1",
        effect: "some effect 1",
        main_card: true,
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
