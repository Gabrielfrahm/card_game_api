import { Card, CardRepository } from "#card/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { prismaClient } from "#seedwork/infra";
import { CardModelMapper } from "../card-model.mapper";
import { CardPrismaRepository } from "../card-prisma";

describe("card prisma unit test", () => {
  let repository: CardPrismaRepository;

  beforeEach(async () => {
    repository = new CardPrismaRepository(prismaClient);
    await prismaClient.card.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.card.deleteMany({ where: {} });
  });

  it("Should be inserts a card", async () => {
    let card = new Card({
      name: "some name 4",
      number: 4,
      category: "monster 4",
      image_url: "some image 4",
      description: "some description 4",
      atk: "atk 4",
      def: "def 4",
      effect: "some effect 4",
      main_card: true,
    });

    await repository.insert(card);
    let model = await prismaClient.card.findUnique({
      where: {
        id: card.id,
      },
    });
    expect(card.toJSON()).toStrictEqual({
      id: model.id,
      name: model.name,
      number: model.number,
      category: model.category,
      image_url: model.image_url,
      description: model.description,
      atk: model.atk,
      def: model.def,
      effect: model.effect,
      main_card: model.main_card,
      created_at: model.created_at,
    });
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
    const uuid = new UniqueEntityId();
    await expect(repository.findById(uuid)).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID ${uuid}`)
    );
  });

  it("should finds a entity by id", async () => {
    let card = new Card({
      name: "some name 4",
      number: 4,
      category: "monster 4",
      image_url: "some image 4",
      description: "some description 4",
      atk: "atk 4",
      def: "def 4",
      effect: "some effect 4",
      main_card: true,
    });

    await repository.insert(card);

    let entityFound = await repository.findById(card.id);
    expect(card.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(card.uniqueEntityId);
    expect(card.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all  cards", async () => {
    let card = new Card({
      name: "some name 4",
      number: 4,
      category: "monster 4",
      image_url: "some image 4",
      description: "some description 4",
      atk: "atk 4",
      def: "def 4",
      effect: "some effect 4",
      main_card: true,
    });

    await repository.insert(card);
    const entities = await repository.findAll();

    expect(entities).toHaveLength(1);
  });

  it("should throw error on delete when a entity not found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );

    await expect(
      repository.delete(
        new UniqueEntityId("b868db19-24cd-45e2-b527-8b7b16c0463b")
      )
    ).rejects.toThrow(
      new NotFoundError(
        "Entity Not Found Using ID b868db19-24cd-45e2-b527-8b7b16c0463b"
      )
    );
  });

  it("should delete an entity", async () => {
    let entity = new Card({
      name: "some name 4",
      number: 4,
      category: "monster 4",
      image_url: "some image 4",
      description: "some description 4",
      atk: "atk 4",
      def: "def 4",
      effect: "some effect 4",
      main_card: true,
    });
    await repository.insert(entity);

    await repository.delete(entity.id);
    const entityFound = await prismaClient.card.findUnique({
      where: { id: entity.id },
    });

    expect(entityFound).toBeNull();
  });

  describe("search method test", () => {
    it("should only apply paginate when other params are null ", async () => {
      const created_at = new Date();

      let entity = new Card({
        name: "some name 4",
        number: 4,
        category: "monster 4",
        image_url: "some image 4",
        description: "some description 4",
        atk: "atk 4",
        def: "def 4",
        effect: "some effect 4",
        main_card: true,
        created_at: created_at,
      });
      await repository.insert(entity);
      entity = new Card({
        name: "some name 5",
        number: 5,
        category: "monster 5",
        image_url: "some image 5",
        description: "some description 5",
        atk: "atk 5",
        def: "def 5",
        effect: "some effect 5",
        main_card: false,
        created_at: created_at,
      });
      await repository.insert(entity);
      entity = new Card({
        name: "some name 1",
        number: 1,
        category: "monster 1",
        image_url: "some image 1",
        description: "some description 1",
        atk: "atk 1",
        def: "def 1",
        effect: "some effect 1",
        main_card: false,
        created_at: created_at,
      });
      await repository.insert(entity);
      entity = new Card({
        name: "some name 3",
        number: 3,
        category: "monster 3",
        image_url: "some image 3",
        description: "some description 3",
        atk: "atk 3",
        def: "def 3",
        effect: "some effect 3",
        main_card: false,
        created_at: created_at,
      });
      await repository.insert(entity);

      const spyToEntity = jest.spyOn(CardModelMapper, "toEntity");

      const searchOutput = await repository.search(
        new CardRepository.SearchParams({})
      );

      expect(searchOutput).toBeInstanceOf(CardRepository.CardSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(4);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 4,
        current_page: 1,
        last_page: 1,
        per_page: 10,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Card);
        expect(item.id).toBeDefined();
      });
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();

      const arrange = [
        new Card({
          name: "some name 1",
          number: 1,
          category: "monster 1",
          image_url: "some image 1",
          description: "some description 1",
          atk: "atk 1",
          def: "def 1",
          effect: "some effect 1",
          main_card: false,
          created_at: created_at,
        }),
        new Card({
          name: "some name 2",
          number: 2,
          category: "monster 2",
          image_url: "some image 2",
          description: "some description 2",
          atk: "atk 2",
          def: "def 2",
          effect: "some effect 2",
          main_card: false,
          created_at: created_at,
        }),
        new Card({
          name: "some name 3",
          number: 3,
          category: "monster 3",
          image_url: "some image 3",
          description: "some description 3",
          atk: "atk 3",
          def: "def 3",
          effect: "some effect 3",
          main_card: false,
          created_at: created_at,
        }),
      ];

      await prismaClient.card.create({
        data: {
          name: arrange[0].name,
          number: arrange[0].number,
          category: arrange[0].category,
          image_url: arrange[0].image_url,
          description: arrange[0].description,
          atk: arrange[0].atk,
          def: arrange[0].def,
          effect: arrange[0].effect,
          main_card: arrange[0].main_card,
          created_at: created_at,
        },
      });

      await prismaClient.card.create({
        data: {
          name: arrange[1].name,
          number: arrange[1].number,
          category: arrange[1].category,
          image_url: arrange[1].image_url,
          description: arrange[1].description,
          atk: arrange[1].atk,
          def: arrange[1].def,
          effect: arrange[1].effect,
          main_card: arrange[1].main_card,
          created_at: created_at,
        },
      });

      await prismaClient.card.create({
        data: {
          name: arrange[2].name,
          number: arrange[2].number,
          category: arrange[2].category,
          image_url: arrange[2].image_url,
          description: arrange[2].description,
          atk: arrange[2].atk,
          def: arrange[2].def,
          effect: arrange[2].effect,
          main_card: arrange[2].main_card,
          created_at: created_at,
        },
      });

      const searchOutput = await repository.search(
        new CardRepository.SearchParams()
      );
      searchOutput.items.reverse().forEach((item) => {
        expect(`${item.name}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const created_at = new Date();

      const cardProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          name: "some name 1",
          number: 1,
          category: "monster 1",
          image_url: "some image 1",
          description: "some description 1",
          atk: "atk 1",
          def: "def 1",
          effect: "some effect 1",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          name: "some name 2",
          number: 2,
          category: "monster 2",
          image_url: "some image 2",
          description: "some description 2",
          atk: "atk 2",
          def: "def 2",
          effect: "some effect 2",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          name: "some name 3",
          number: 3,
          category: "monster 3",
          image_url: "some image 3",
          description: "some description 3",
          atk: "atk 3",
          def: "def 3",
          effect: "some effect 3",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          name: "some name 4",
          number: 4,
          category: "monster 4",
          image_url: "some image 4",
          description: "some description 4",
          atk: "atk 4",
          def: "def 4",
          effect: "some effect 4",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          name: "some name 5",
          number: 5,
          category: "monster 5",
          image_url: "some image 5",
          description: "some description 5",
          atk: "atk 5",
          def: "def 5",
          effect: "some effect 5",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          name: "some name 6",
          number: 6,
          category: "monster 6",
          image_url: "some image 6",
          description: "some description 6",
          atk: "atk 6",
          def: "def 6",
          effect: "some effect 6",
          main_card: false,
          created_at: created_at,
        },
      ];

      let arrayCards = [];
      for (let cards of cardProps) {
        const card = await prismaClient.card.create({
          data: {
            id: cards.id,
            name: cards.name,
            number: cards.number,
            category: cards.category,
            image_url: cards.image_url,
            description: cards.description,
            atk: cards.atk,
            def: cards.def,
            effect: cards.effect,
            main_card: cards.main_card,
          },
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
        });
        arrayCards.push(card);
      }

      let result = await repository.search(
        new CardRepository.SearchParams({
          page: 1,
          per_page: 2,
          column: "name",
          filter: "some name 1",
        })
      );

      expect(JSON.stringify(result.toJSON(true))).toMatch(
        JSON.stringify(
          new CardRepository.CardSearchResult({
            items: [CardModelMapper.toEntity(arrayCards[0])],
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
        new CardRepository.SearchParams({
          page: 1,
          per_page: 2,
          filter: "some name 1",
          column: "name",
        })
      );
      expect(JSON.stringify(result.toJSON(true))).toMatch(
        JSON.stringify(
          new CardRepository.CardSearchResult({
            items: [CardModelMapper.toEntity(arrayCards[0])],
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
      const created_at = new Date();

      const cardProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          name: "b",
          number: 1,
          category: "monster 1",
          image_url: "some image 1",
          description: "some description 1",
          atk: "atk 1",
          def: "def 1",
          effect: "some effect 1",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          name: "a",
          number: 2,
          category: "monster 2",
          image_url: "some image 2",
          description: "some description 2",
          atk: "atk 2",
          def: "def 2",
          effect: "some effect 2",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          name: "c",
          number: 3,
          category: "monster 3",
          image_url: "some image 3",
          description: "some description 3",
          atk: "atk 3",
          def: "def 3",
          effect: "some effect 3",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          name: "e",
          number: 4,
          category: "monster 4",
          image_url: "some image 4",
          description: "some description 4",
          atk: "atk 4",
          def: "def 4",
          effect: "some effect 4",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          name: "d",
          number: 5,
          category: "monster 5",
          image_url: "some image 5",
          description: "some description 5",
          atk: "atk 5",
          def: "def 5",
          effect: "some effect 5",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          name: "f",
          number: 6,
          category: "monster 6",
          image_url: "some image 6",
          description: "some description 6",
          atk: "atk 6",
          def: "def 6",
          effect: "some effect 6",
          main_card: false,
          created_at: created_at,
        },
      ];

      let arrayCards = [];
      for (let cards of cardProps) {
        const card = await prismaClient.card.create({
          data: {
            id: cards.id,
            name: cards.name,
            number: cards.number,
            category: cards.category,
            image_url: cards.image_url,
            description: cards.description,
            atk: cards.atk,
            def: cards.def,
            effect: cards.effect,
            main_card: cards.main_card,
            created_at: created_at,
          },
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
        });
        arrayCards.push(card);
      }

      const arrange = [
        {
          params: new CardRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CardRepository.CardSearchResult({
            items: [
              CardModelMapper.toEntity(arrayCards[1]),
              CardModelMapper.toEntity(arrayCards[0]),
            ],
            per_page: 2,
            current_page: 1,
            total: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new CardRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CardRepository.CardSearchResult({
            items: [
              CardModelMapper.toEntity(arrayCards[2]),
              CardModelMapper.toEntity(arrayCards[4]),
            ],
            per_page: 2,
            current_page: 2,
            total: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new CardRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CardRepository.CardSearchResult({
            items: [
              CardModelMapper.toEntity(arrayCards[5]),
              CardModelMapper.toEntity(arrayCards[3]),
            ],
            per_page: 2,
            current_page: 1,
            total: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new CardRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CardRepository.CardSearchResult({
            items: [
              CardModelMapper.toEntity(arrayCards[4]),
              CardModelMapper.toEntity(arrayCards[2]),
            ],
            per_page: 2,
            current_page: 2,
            total: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
            column: null,
          }),
        },
      ];

      for (const item of arrange) {
        let result = await repository.search(item.params);

        expect(JSON.stringify(result.toJSON(true))).toMatch(
          JSON.stringify(item.result.toJSON(true))
        );
      }
    });

    it("should search using filter, sort and paginate", async () => {
      const created_at = new Date();

      const cardProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          name: "test",
          number: 1,
          category: "monster 1",
          image_url: "some image 1",
          description: "some description 1",
          atk: "atk 1",
          def: "def 1",
          effect: "some effect 1",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          name: "FAKE",
          number: 2,
          category: "monster 2",
          image_url: "some image 2",
          description: "some description 2",
          atk: "atk 2",
          def: "def 2",
          effect: "some effect 2",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          name: "some name",
          number: 3,
          category: "monster 3",
          image_url: "some image 3",
          description: "some description 3",
          atk: "atk 3",
          def: "def 3",
          effect: "some effect 3",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          name: "a",
          number: 4,
          category: "monster 4",
          image_url: "some image 4",
          description: "some description 4",
          atk: "atk 4",
          def: "def 4",
          effect: "some effect 4",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          name: "fake",
          number: 5,
          category: "monster 5",
          image_url: "some image 5",
          description: "some description 5",
          atk: "atk 5",
          def: "def 5",
          effect: "some effect 5",
          main_card: false,
          created_at: created_at,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          name: "TEST",
          number: 6,
          category: "monster 6",
          image_url: "some image 6",
          description: "some description 6",
          atk: "atk 6",
          def: "def 6",
          effect: "some effect 6",
          main_card: false,
          created_at: created_at,
        },
      ];

      let arrayCards = [];
      for (let cards of cardProps) {
        const card = await prismaClient.card.create({
          data: {
            id: cards.id,
            name: cards.name,
            number: cards.number,
            category: cards.category,
            image_url: cards.image_url,
            description: cards.description,
            atk: cards.atk,
            def: cards.def,
            effect: cards.effect,
            main_card: cards.main_card,
            created_at: created_at,
          },
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
        });
        arrayCards.push(card);
      }

      const arrange = [
        {
          params: new CardRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
            column: "name",
          }),
          result: new CardRepository.CardSearchResult({
            items: [
              CardModelMapper.toEntity(arrayCards[5]),
              CardModelMapper.toEntity(arrayCards[0]),
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
          params: new CardRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "FAKE",
            column: "name",
          }),
          result: new CardRepository.CardSearchResult({
            items: [
              CardModelMapper.toEntity(arrayCards[1]),
              CardModelMapper.toEntity(arrayCards[4]),
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
        let result = await repository.search(item.params);
        expect(JSON.stringify(result.toJSON(true))).toMatch(
          JSON.stringify(item.result.toJSON(true))
        );
      }
    });
  });
});
