import { Deck } from "#deck/domain";
import { DeckPrismaRepository } from "#deck/infra";
import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { User } from "#user/domain";
import ListDeckUseCase from "../../list-deck.usecase";

describe("list Deck use case integration test", () => {
  let repository: DeckPrismaRepository;
  let useCase: ListDeckUseCase.UseCase;

  beforeEach(async () => {
    repository = new DeckPrismaRepository(prismaClient);
    useCase = new ListDeckUseCase.UseCase(repository);
    await prismaClient.deck.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.deck.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    const user = new User(new BcryptAdapter.HasherAdapter(12), {
      email: "dale@dale.com",
      name: "user",
      password: "123",
    });
    await prismaClient.user.create({
      data: {
        id: user.id,
        email: user.email,
        email_confirmation: user.email_confirmation,
        name: user.name,
        password: user.password,
      },
    });
    let deck = new Deck({
      name: "some name 1",
      user: user,
      main_card: null,
    });

    await repository.insert(deck);
    deck = new Deck({
      name: "some name 2",
      user: user,
      main_card: null,
    });
    await repository.insert(deck);

    const models = await prismaClient.deck.findMany({
      select: {
        id: true,
        name: true,
        user: {
          select: {
            id: true,
            email: true,
            email_confirmation: true,
            name: true,
            password: true,
            created_at: true,
          },
        },
        user_id: true,
        DeckCard: {
          include: {
            card: {
              select: {
                id: true,
                name: true,
                number: true,
                description: true,
                category: true,
                atk: true,
                def: true,
                effect: true,
                image_url: true,
                main_card: true,
                created_at: true,
              },
            },
          },
        },
        card: {
          select: {
            id: true,
            name: true,
            number: true,
            description: true,
            category: true,
            atk: true,
            def: true,
            effect: true,
            image_url: true,
            main_card: true,
            created_at: true,
          },
        },
        main_card_id: true,
        created_at: true,
      },
    });
    const output = await useCase.execute({} as any);

    expect({
      total: output.total,
      current_page: output.current_page,
      last_page: output.last_page,
      per_page: output.per_page,
    }).toStrictEqual({
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 10,
    });
  });
});
