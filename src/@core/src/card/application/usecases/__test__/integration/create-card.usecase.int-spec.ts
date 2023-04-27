import { CardPrismaRepository } from "#card/infra/db/prisma/card-prisma";
import { prismaClient } from "#seedwork/infra";
import CreateCardUseCase from "../../create-card.usecase";

describe("create card use case integration test", () => {
  let repository: CardPrismaRepository;
  let useCase: CreateCardUseCase.UseCase;

  beforeEach(async () => {
    repository = new CardPrismaRepository(prismaClient);
    useCase = new CreateCardUseCase.UseCase(repository);
    await prismaClient.card.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.card.deleteMany({ where: {} });
  });

  it("should create a card", async () => {
    const spyRepository = jest.spyOn(repository, "insert");
    let output = await useCase.execute({
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
    });
    const entity = await repository.findById(output.id);
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      number: entity.number,
      category: entity.category,
      image_url: entity.image_url,
      description: entity.description,
      atk: entity.atk,
      def: entity.def,
      effect: entity.effect,
      main_card: entity.main_card,
      created_at: entity.created_at,
    });
  });
});
