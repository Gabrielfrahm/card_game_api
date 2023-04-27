import { CardPrismaRepository } from "#card/infra/db/prisma/card-prisma";
import { NotFoundError } from "#seedwork/domain";
import { prismaClient } from "#seedwork/infra";
import GetCardUseCase from "../../get-card.usecase";

describe("get user use case integration test", () => {
  let repository: CardPrismaRepository;
  let useCase: GetCardUseCase.UseCase;

  beforeEach(async () => {
    repository = new CardPrismaRepository(prismaClient);
    useCase = new GetCardUseCase.UseCase(repository);
    await prismaClient.card.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.card.deleteMany({ where: {} });
  });

  it("should throws error when entity not found", async () => {
    await expect(useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
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

    const output = await useCase.execute({ id: model.id });
    const response = await prismaClient.card.findUnique({
      where: {
        id: model.id,
      },
      select: {
        id: true,
        name: true,
        number: true,
        category: true,
        image_url: true,
        description: true,
        atk: true,
        def: true,
        effect: true,
        main_card: true,
        created_at: true,
      },
    });
    expect(output).toStrictEqual({
      id: response.id,
      name: response.name,
      number: response.number,
      category: response.category,
      image_url: response.image_url,
      description: response.description,
      atk: response.atk,
      def: response.def,
      effect: response.effect,
      main_card: response.main_card,
      created_at: response.created_at,
    });
  });
});
