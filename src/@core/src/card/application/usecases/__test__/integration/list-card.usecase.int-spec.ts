import { CardPrismaRepository } from "#card/infra/db/prisma/card-prisma";
import { prismaClient } from "#seedwork/infra";
import ListCardUseCase from "../../list-card.usecase";

describe("list card use case integration test", () => {
  let repository: CardPrismaRepository;
  let useCase: ListCardUseCase.UseCase;

  beforeEach(async () => {
    repository = new CardPrismaRepository(prismaClient);
    useCase = new ListCardUseCase.UseCase(repository);
    await prismaClient.card.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.card.deleteMany({ where: {} });
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    await prismaClient.card.create({
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
    await prismaClient.card.create({
      data: {
        name: "some name 2",
        number: 2,
        category: "monster 2",
        image_url: "some image 2",
        description: "some description 2",
        atk: "atk 2",
        def: "def 2",
        effect: "some effect 2",
        main_card: true,
        created_at: new Date(),
      },
    });

    const models = await prismaClient.card.findMany({
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
        Deck: true,
        DeckCard: true,
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
        name: "a",
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
      {
        name: "AAA",
        number: 2,
        category: "monster 2",
        image_url: "some image 2",
        description: "some description 2",
        atk: "atk 2",
        def: "def 2",
        effect: "some effect 2",
        main_card: true,
        created_at: new Date(),
      },
      {
        name: "AaA",
        number: 3,
        category: "monster 3",
        image_url: "some image 3",
        description: "some description 3",
        atk: "atk 3",
        def: "def 3",
        effect: "some effect 3",
        main_card: true,
        created_at: new Date(),
      },
      {
        name: "B",
        number: 4,
        category: "monster 4",
        image_url: "some image 4",
        description: "some description 4",
        atk: "atk 4",
        def: "def 4",
        effect: "some effect 4",
        main_card: true,
        created_at: new Date(),
      },
      {
        name: "c",
        number: 5,
        category: "monster 5",
        image_url: "some image 5",
        description: "some description 5",
        atk: "atk 5",
        def: "def 5",
        effect: "some effect 5",
        main_card: true,
        created_at: new Date(),
      },
    ];

    for (let card of arrange) {
      await prismaClient.card.create({
        data: { ...card },
      });
    }
    const models = await prismaClient.card.findMany({
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
        Deck: true,
        DeckCard: true,
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
