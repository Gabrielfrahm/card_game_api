import { CreateCardUseCase } from "#card/application";
import { CardInMemoryRepository } from "#card/infra";
import { DeckInMemoryRepository } from "#deck/infra";
import { BcryptAdapter } from "#seedwork/infra";
import { CreateUserUseCase } from "#user/application";
import { UserInMemoryRepository } from "#user/infra";
import CreateDeckUseCase from "../../create-deck.usecase";

describe("create deck use case unit test", () => {
  let repository: DeckInMemoryRepository;
  let cardRepository: CardInMemoryRepository;
  let userRepository: UserInMemoryRepository;
  let useCase: CreateDeckUseCase.UseCase;
  let cardUseCase: CreateCardUseCase.UseCase;
  let userUseCase: CreateUserUseCase.UseCase;

  beforeEach(() => {
    repository = new DeckInMemoryRepository();
    cardRepository = new CardInMemoryRepository();
    userRepository = new UserInMemoryRepository();
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
  });

  it("should create a deck", async () => {
    const spyRepository = jest.spyOn(repository, "insert");
    let card = await cardUseCase.execute({
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
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: repository.items[0].name,
      user: repository.items[0].user,
      cards: repository.items[0].cards,
      main_card: repository.items[0].main_card,
      created_at: repository.items[0].created_at,
    });
  });
});
