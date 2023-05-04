import { Card } from "#card/domain";
import { CardModelMapper } from "#card/infra";
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
    await prismaClient.deckCard.deleteMany({ where: {} });
  });

  it("Should be crud a deck", async () => {
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

    let deckFind = await repository.findById(model.id);
    expect(deckFind.id).toBe(deck.id);

    let decksFind = await repository.findAll();
    expect(decksFind).toHaveLength(1);

    const newCard = await prismaClient.card.create({
      data: {
        id: "81513b4a-90a6-44c1-b2bd-142ecf66f075",
        name: "some name 2",
        number: 2,
        category: "monster 2",
        image_url: "some image 2",
        description: "some description 2",
        atk: "atk 2",
        def: "def 2",
        effect: "some effect 2",
        main_card: true,
      },
    });
    deck.addCard(CardModelMapper.toEntity(newCard));
    deck.update({ name: "new name" });
    await repository.update(deck);
    deckFind = await repository.findById(model.id);
    expect(deckFind.cards).toHaveLength(2);
    expect(deckFind.name).toBe("new name");

    deck.update({ main_card: CardModelMapper.toEntity(newCard) });
    await repository.update(deck);
    deckFind = await repository.findById(model.id);

    expect(deckFind.main_card.id).toBe(newCard.id);

    deck.removeCard(newCard.id);
    await repository.update(deck);
    deckFind = await repository.findById(model.id);
    expect(deckFind.cards).toHaveLength(1);

    await repository.delete(model.id);
    decksFind = await repository.findAll();
    await prismaClient.card.delete({
      where: {
        id: newCard.id,
      },
    });
    expect(decksFind).toHaveLength(0);
  });

  describe("search method test", () => {
    it("should only apply paginate when other params are null ", async () => {});
  });
});
