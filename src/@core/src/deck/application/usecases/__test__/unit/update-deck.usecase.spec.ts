import { CreateCardUseCase } from "#card/application";
import { Card } from "#card/domain";
import { CardInMemoryRepository } from "#card/infra";
import { Deck } from "#deck/domain";
import { DeckInMemoryRepository } from "#deck/infra";
import { UniqueEntityId } from "#seedwork/domain";
import { BcryptAdapter } from "#seedwork/infra";
import { CreateUserUseCase } from "#user/application";
import { User } from "#user/domain";
import UpdateDeckUseCase from "../../update-deck.usecase";

describe("update deck use case unit test", () => {
  let repository: DeckInMemoryRepository;
  let cardRepository: CardInMemoryRepository;
  let useCase: UpdateDeckUseCase.UseCase;
  let cardUseCase: CreateCardUseCase.UseCase;

  beforeEach(() => {
    repository = new DeckInMemoryRepository();
    cardRepository = new CardInMemoryRepository();
    useCase = new UpdateDeckUseCase.UseCase(repository, cardRepository);
    cardUseCase = new CreateCardUseCase.UseCase(cardRepository);
  });

  it("should update a deck", async () => {
    const spyRepository = jest.spyOn(repository, "update");
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

    const deck = new Deck({
      name: "deck 1",
      user: new User(
        new BcryptAdapter.HasherAdapter(12),
        {
          email: "dale@dale.com",
          name: "user 1",
          password: "123",
        },
        new UniqueEntityId("8c85dc97-ee89-4a87-b776-daef12976e0a")
      ),
      cards: [
        new Card(
          {
            name: "some name 4",
            number: 4,
            category: "monster 4",
            image_url: "some image 4",
            description: "some description 4",
            atk: "atk 4",
            def: "def 4",
            effect: "some effect 4",
            main_card: true,
          },
          new UniqueEntityId("c1813f74-6815-4639-b8c2-957f8c7ddceb")
        ),
      ],
      main_card: new Card(
        {
          name: "some name 4",
          number: 4,
          category: "monster 4",
          image_url: "some image 4",
          description: "some description 4",
          atk: "atk 4",
          def: "def 4",
          effect: "some effect 4",
          main_card: true,
        },
        new UniqueEntityId("c1813f74-6815-4639-b8c2-957f8c7ddceb")
      ),
    });

    repository.items = [deck];

    let output = await useCase.execute({
      id: deck.id,
      name: "deck update",
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
