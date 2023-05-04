import { Card } from "#card/domain";
import { Deck } from "#deck/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { User } from "#user/domain";
import { DeckModelMapper } from "../deck-model.mapper";

describe("Deck Model Mapper  unit test", () => {
  beforeEach(async () => {
    await prismaClient.deck.deleteMany({ where: {} });
    await prismaClient.card.deleteMany({ where: {} });
    await prismaClient.deckCard.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.deck.deleteMany({ where: {} });
    await prismaClient.deckCard.deleteMany({ where: {} });
    await prismaClient.card.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should convert a deck model to a deck entity", async () => {
    const created_at = new Date();
    await prismaClient.user.create({
      data: {
        id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
        email: "dale@dale.com",
        email_confirmation: false,
        name: "user 1",
        password: "123",
        created_at,
      },
    });

    await prismaClient.card.create({
      data: {
        id: "c1813f74-6815-4639-b8c2-957f8c7ddceb",
        name: "some name 4",
        number: 4,
        category: "monster 4",
        image_url: "some image 4",
        description: "some description 4",
        atk: "atk 4",
        def: "def 4",
        effect: "some effect 4",
        main_card: true,
        created_at,
      },
    });

    const deck = new Deck({
      name: "deck 1",
      user: new User(
        new BcryptAdapter.HasherAdapter(12),
        {
          email: "dale@dale.com",
          name: "user 1",
          password: "123",
          created_at,
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
            created_at,
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
          created_at,
        },
        new UniqueEntityId("c1813f74-6815-4639-b8c2-957f8c7ddceb")
      ),
      created_at: created_at,
    });

    const model = await prismaClient.deck.create({
      data: {
        id: deck.id,
        name: deck.name,
        user_id: deck.user.id,
        main_card_id: deck.main_card.id,
        DeckCard: {
          create: [{ card_id: deck.cards[0].id }],
        },
        created_at,
      },
      select: {
        id: true,
        name: true,
        user: true,
        user_id: true,
        DeckCard: {
          include: {
            card: true,
          },
        },
        card: true,
        main_card_id: true,
        created_at: true,
      },
    });

    const entity = DeckModelMapper.toEntity(model);

    // expect(entity.toJSON()).toBe(deck.toJSON());
  });
});
