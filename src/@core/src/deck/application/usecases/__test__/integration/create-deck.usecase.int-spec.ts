import { CreateCardUseCase } from "#card/application";
import { CardPrismaRepository } from "#card/infra";
import { DeckPrismaRepository } from "#deck/infra";
import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { CreateUserUseCase } from "#user/application";
import { UserPrismaRepository } from "#user/infra";
import CreateDeckUseCase from "../../create-deck.usecase";

describe("create card use case integration test", () => {
  let repository: DeckPrismaRepository;
  let cardRepository: CardPrismaRepository;
  let userRepository: UserPrismaRepository;
  let useCase: CreateDeckUseCase.UseCase;
  let cardUseCase: CreateCardUseCase.UseCase;
  let userUseCase: CreateUserUseCase.UseCase;

  beforeEach(async () => {
    repository = new DeckPrismaRepository(prismaClient);
    cardRepository = new CardPrismaRepository(prismaClient);
    userRepository = new UserPrismaRepository(prismaClient);
    useCase = new CreateDeckUseCase.UseCase(
      repository,
      cardRepository,
      userRepository
    );
    cardUseCase = new CreateCardUseCase.UseCase(cardRepository);
    userUseCase = new CreateUserUseCase.UseCase(
      userRepository,
      new BcryptAdapter.HasherAdapter(12)
    );

    await prismaClient.deck.deleteMany({ where: {} });
    await prismaClient.deckCard.deleteMany({ where: {} });
    await prismaClient.card.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterAll(async () => {
    await prismaClient.deck.deleteMany({ where: {} });
    await prismaClient.deckCard.deleteMany({ where: {} });
    await prismaClient.card.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should create a card", async () => {
    const spyRepository = jest.spyOn(repository, "insert");
    let card = await cardUseCase.execute({
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
    });

    let user = await userUseCase.execute({
      email: "email@email.com",
      name: "dale",
      password: "123",
      created_at: new Date(),
    });

    let output = await useCase.execute({
      name: "deck",
      user_id: user.id,
      cards: [card.id],
      main_card_id: card.id,
    });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    const entity = await repository.findById(output.id);
  });
});
