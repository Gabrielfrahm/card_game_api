import { Card } from "#card/domain";
import { CardModelMapper } from "#card/infra";
import { Deck, DeckRepository } from "#deck/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { BcryptAdapter, prismaClient } from "#seedwork/infra";
import { User } from "#user/domain";
import { DeckModelMapper } from "../deck-model.mapper";
import { DeckPrismaRepository } from "../deck-prisma";

describe("deck prisma unit test", () => {
  let repository: DeckPrismaRepository;

  beforeEach(async () => {
    repository = new DeckPrismaRepository(prismaClient);
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

  it("Should be crud a deck", async () => {
    await prismaClient.user.create({
      data: {
        id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
        email: "dale@dale.com",
        email_confirmation: false,
        name: "user 1",
        password: "123",
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
      },
    });
    const card = new Card(
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
    );

    const user = new User(
      new BcryptAdapter.HasherAdapter(12),
      {
        email: "dale@dale.com",
        name: "user 1",
        password: "123",
      },
      new UniqueEntityId("8c85dc97-ee89-4a87-b776-daef12976e0a")
    );
    const deck = new Deck({
      name: "deck 1",
      user: user,
      cards: [card],
      main_card: card,
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

    let decksFind = await repository.findAll(
      "8c85dc97-ee89-4a87-b776-daef12976e0a"
    );
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

    await repository.delete(model.id);
    decksFind = await repository.findAll(
      "8c85dc97-ee89-4a87-b776-daef12976e0a"
    );
    await prismaClient.card.delete({
      where: {
        id: newCard.id,
      },
    });
    expect(decksFind).toHaveLength(0);
  });

  describe("search method test", () => {
    it("should only apply paginate when other params are null ", async () => {
      await prismaClient.user.create({
        data: {
          id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
          email: "dale@dale.com",
          email_confirmation: false,
          name: "user 1",
          password: "123",
        },
      });
      const user = new User(
        new BcryptAdapter.HasherAdapter(12),
        {
          email: "dale@dale.com",
          name: "user 1",
          password: "123",
        },
        new UniqueEntityId("8c85dc97-ee89-4a87-b776-daef12976e0a")
      );
      let deck = new Deck({
        name: "deck 1",
        user,
      });
      await repository.insert(deck);
      deck = new Deck({
        name: "deck 2",
        user,
      });
      await repository.insert(deck);
      deck = new Deck({
        name: "deck 3",
        user,
      });
      await repository.insert(deck);

      const spyToEntity = jest.spyOn(DeckModelMapper, "toEntity");
      const searchOutput = await repository.search(
        new DeckRepository.SearchParams({}),
        "8c85dc97-ee89-4a87-b776-daef12976e0a"
      );
      expect(searchOutput).toBeInstanceOf(DeckRepository.DeckSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(3);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 3,
        current_page: 1,
        last_page: 1,
        per_page: 10,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Deck);
        expect(item.id).toBeDefined();
      });
    });

    it("should order by created_at DESC when search params are null", async () => {
      await prismaClient.user.create({
        data: {
          id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
          email: "dale@dale.com",
          email_confirmation: false,
          name: "user 1",
          password: "123",
        },
      });
      const created_at = new Date();
      const user = new User(
        new BcryptAdapter.HasherAdapter(12),
        {
          email: "dale@dale.com",
          name: "user 1",
          password: "123",
        },
        new UniqueEntityId("8c85dc97-ee89-4a87-b776-daef12976e0a")
      );
      const arrange = [
        new Deck({
          name: "deck 1",
          user: user,
          created_at,
        }),
        new Deck({
          name: "deck 2",
          user: user,
          created_at,
        }),
        new Deck({
          name: "deck 3",
          user: user,
          created_at,
        }),
      ];

      await prismaClient.deck.create({
        data: {
          name: arrange[0].name,
          user_id: arrange[0].user.id,
          main_card_id: null,
          created_at: arrange[0].created_at,
        },
      });
      await prismaClient.deck.create({
        data: {
          name: arrange[1].name,
          user_id: arrange[1].user.id,
          main_card_id: null,
          created_at: arrange[1].created_at,
        },
      });
      await prismaClient.deck.create({
        data: {
          name: arrange[2].name,
          user_id: arrange[2].user.id,
          main_card_id: null,
          created_at: arrange[2].created_at,
        },
      });

      const searchOutput = await repository.search(
        new DeckRepository.SearchParams(),
        "8c85dc97-ee89-4a87-b776-daef12976e0a"
      );
      searchOutput.items.reverse().forEach((item, index) => {
        expect(`${item.name}${index + 1}`);
      });
    });

    it("should apply paginate and filter", async () => {
      await prismaClient.user.create({
        data: {
          id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
          email: "dale@dale.com",
          email_confirmation: false,
          name: "user 1",
          password: "123",
        },
      });
      const created_at = new Date();
      const user = new User(
        new BcryptAdapter.HasherAdapter(12),
        {
          email: "dale@dale.com",
          name: "user 1",
          password: "123",
        },
        new UniqueEntityId("8c85dc97-ee89-4a87-b776-daef12976e0a")
      );
      const deckProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          name: "some name 1",
          user: user,
          created_at: created_at,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          name: "some name 2",
          user: user,
          created_at: created_at,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          name: "some name 3",
          user: user,
          created_at: created_at,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          name: "some name 4",
          user: user,
          created_at: created_at,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          name: "some name 5",
          user: user,
          created_at: created_at,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          name: "some name 6",
          user: user,
          created_at: created_at,
        },
      ];
      let arrayDecks = [];
      for (let decks of deckProps) {
        const deck = await prismaClient.deck.create({
          data: {
            id: decks.id,
            name: decks.name,
            user_id: decks.user.id,
            main_card_id: null,
            created_at: decks.created_at,
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
            _count: true,
          },
        });
        arrayDecks.push(deck);
      }
      let result = await repository.search(
        new DeckRepository.SearchParams({
          page: 1,
          per_page: 2,
          column: "name",
          filter: "some name 1",
        }),
        "8c85dc97-ee89-4a87-b776-daef12976e0a"
      );

      expect(JSON.stringify(result.toJSON(true))).toMatch(
        JSON.stringify(
          new DeckRepository.DeckSearchResult({
            items: [DeckModelMapper.toEntity(arrayDecks[0])],
            total: 1,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: "some name 1",
            column: "name",
          }).toJSON(true)
        )
      );

      result = await repository.search(
        new DeckRepository.SearchParams({
          page: 1,
          per_page: 2,
          filter: "some name 1",
          column: "name",
        }),
        "8c85dc97-ee89-4a87-b776-daef12976e0a"
      );

      expect(JSON.stringify(result.toJSON(true))).toMatch(
        JSON.stringify(
          new DeckRepository.DeckSearchResult({
            items: [DeckModelMapper.toEntity(arrayDecks[0])],
            total: 1,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: "some name 1",
            column: "name",
          }).toJSON(true)
        )
      );
    });

    it("should apply paginate and sort", async () => {
      await prismaClient.user.create({
        data: {
          id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
          email: "dale@dale.com",
          email_confirmation: false,
          name: "user 1",
          password: "123",
        },
      });
      const created_at = new Date();
      const user = new User(
        new BcryptAdapter.HasherAdapter(12),
        {
          email: "dale@dale.com",
          name: "user 1",
          password: "123",
        },
        new UniqueEntityId("8c85dc97-ee89-4a87-b776-daef12976e0a")
      );
      const deckProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          name: "b",
          user: user,
          created_at: created_at,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          name: "a",
          user: user,
          created_at: created_at,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          name: "c",
          user: user,
          created_at: created_at,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          name: "e",
          user: user,
          created_at: created_at,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          name: "d",
          user: user,
          created_at: created_at,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          name: "f",
          user: user,
          created_at: created_at,
        },
      ];
      let arrayDecks = [];
      for (let decks of deckProps) {
        const deck = await prismaClient.deck.create({
          data: {
            id: decks.id,
            name: decks.name,
            user_id: decks.user.id,
            main_card_id: null,
            created_at: decks.created_at,
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
            _count: true,
          },
        });
        arrayDecks.push(deck);
      }

      const arrange = [
        {
          params: new DeckRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new DeckRepository.DeckSearchResult({
            items: [
              DeckModelMapper.toEntity(arrayDecks[1]),
              DeckModelMapper.toEntity(arrayDecks[0]),
            ],
            per_page: 2,
            current_page: 1,
            total: 6,
            sort: "name",
            sort_dir: "asc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new DeckRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new DeckRepository.DeckSearchResult({
            items: [
              DeckModelMapper.toEntity(arrayDecks[2]),
              DeckModelMapper.toEntity(arrayDecks[4]),
            ],
            per_page: 2,
            current_page: 2,
            total: 6,
            sort: "name",
            sort_dir: "asc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new DeckRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new DeckRepository.DeckSearchResult({
            items: [
              DeckModelMapper.toEntity(arrayDecks[5]),
              DeckModelMapper.toEntity(arrayDecks[3]),
            ],
            per_page: 2,
            current_page: 1,
            total: 6,
            sort: "name",
            sort_dir: "desc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new DeckRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new DeckRepository.DeckSearchResult({
            items: [
              DeckModelMapper.toEntity(arrayDecks[4]),
              DeckModelMapper.toEntity(arrayDecks[2]),
            ],
            per_page: 2,
            current_page: 2,
            total: 6,
            sort: "name",
            sort_dir: "desc",
            filter: null,
            column: null,
          }),
        },
      ];

      for (const item of arrange) {
        let result = await repository.search(
          item.params,
          "8c85dc97-ee89-4a87-b776-daef12976e0a"
        );

        expect(JSON.stringify(result.toJSON(true))).toMatch(
          JSON.stringify(item.result.toJSON(true))
        );
      }
    });

    it("should search using filter, sort and paginate", async () => {
      await prismaClient.user.create({
        data: {
          id: "8c85dc97-ee89-4a87-b776-daef12976e0a",
          email: "dale@dale.com",
          email_confirmation: false,
          name: "user 1",
          password: "123",
        },
      });
      const created_at = new Date();
      const user = new User(
        new BcryptAdapter.HasherAdapter(12),
        {
          email: "dale@dale.com",
          name: "user 1",
          password: "123",
        },
        new UniqueEntityId("8c85dc97-ee89-4a87-b776-daef12976e0a")
      );
      const deckProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          name: "test",
          user: user,
          created_at: created_at,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          name: "FAKE",
          user: user,
          created_at: created_at,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          name: "some name",
          user: user,
          created_at: created_at,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          name: "a",
          user: user,
          created_at: created_at,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          name: "fake",
          user: user,
          created_at: created_at,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          name: "TEST",
          user: user,
          created_at: created_at,
        },
      ];
      let arrayDecks = [];
      for (let decks of deckProps) {
        const deck = await prismaClient.deck.create({
          data: {
            id: decks.id,
            name: decks.name,
            user_id: decks.user.id,
            main_card_id: null,
            created_at: decks.created_at,
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
            _count: true,
          },
        });
        arrayDecks.push(deck);
      }

      const arrange = [
        {
          params: new DeckRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
            column: "name",
          }),
          result: new DeckRepository.DeckSearchResult({
            items: [
              DeckModelMapper.toEntity(arrayDecks[5]),
              DeckModelMapper.toEntity(arrayDecks[0]),
            ],
            per_page: 2,
            current_page: 1,
            total: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
            column: "name",
          }),
        },
        {
          params: new DeckRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "FAKE",
            column: "name",
          }),
          result: new DeckRepository.DeckSearchResult({
            items: [
              DeckModelMapper.toEntity(arrayDecks[1]),
              DeckModelMapper.toEntity(arrayDecks[4]),
            ],
            per_page: 2,
            current_page: 1,
            total: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "FAKE",
            column: "name",
          }),
        },
      ];
      for (const item of arrange) {
        let result = await repository.search(
          item.params,
          "8c85dc97-ee89-4a87-b776-daef12976e0a"
        );
        expect(JSON.stringify(result.toJSON(true))).toMatch(
          JSON.stringify(item.result.toJSON(true))
        );
      }
    });
  });
});
