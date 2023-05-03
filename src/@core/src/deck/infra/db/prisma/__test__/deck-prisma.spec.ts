import { Card } from "#card/domain";
import { Deck } from "#deck/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { User } from "#user/domain";
import { DeckPrismaRepository } from "../deck-prisma";

describe("deck prisma unit test", () => {
  let repository: DeckPrismaRepository;

  beforeEach(async () => {
    repository = new DeckPrismaRepository(prismaClient);
    await prismaClient.deck.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.deck.deleteMany({ where: {} });
  });

  it("Should be inserts a deck", async () => {
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

    await repository.insert(deck);
    let model = await prismaClient.deck.findUnique({
      where: {
        id: deck.id,
      },
    });

    expect({
      id: deck.id,
      name: deck.name,
      user_id: deck.user.id,
      main_card_id: deck.main_card.id,
      created_at: deck.created_at,
    }).toStrictEqual({
      id: model.id,
      name: model.name,
      user_id: model.user_id,
      main_card_id: model.main_card_id,
      created_at: model.created_at,
    });

    console.log(await repository.findById(model.id));
  });
});
