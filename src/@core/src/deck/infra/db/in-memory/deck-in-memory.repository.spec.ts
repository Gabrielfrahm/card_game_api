import { Card } from "#card/domain";
import { Deck } from "#deck/domain";
import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";
import DeckInMemoryRepository from "./deck-in-memory.repository";

describe("deck in memory repository unit test", () => {
  let repository: DeckInMemoryRepository;
  beforeEach(() => (repository = new DeckInMemoryRepository()));

  describe("apply filter method", () => {
    it("should no filter items when filter params is null", async () => {
      const items = [
        new Deck({
          name: "some name",
          user: new User(new BcryptAdapter.HasherAdapter(12), {
            email: "teste@teste.com",
            name: "dale",
            password: "123",
          }),
          cards: [
            new Card({
              name: "some name 1 ",
              number: 1,
              category: "monster 1",
              image_url: "some image 1",
              description: "some description 1",
              atk: "atk 1",
              def: "def 1",
              effect: "some effect 1",
              main_card: true,
            }),
            new Card({
              name: "some name 2 ",
              number: 2,
              category: "monster 2",
              image_url: "some image 2",
              description: "some description 2",
              atk: "atk 2",
              def: "def 2",
              effect: "some effect 2",
              main_card: true,
            }),
          ],
          main_card: new Card({
            name: "some name 2 ",
            number: 2,
            category: "monster 2",
            image_url: "some image 2",
            description: "some description 2",
            atk: "atk 2",
            def: "def 2",
            effect: "some effect 2",
            main_card: true,
          }),
        }),
        new Deck({
          name: "some name 2 ",
          user: new User(new BcryptAdapter.HasherAdapter(12), {
            email: "teste@teste.com",
            name: "dale",
            password: "123",
          }),
          cards: [
            new Card({
              name: "some name 2 ",
              number: 2,
              category: "monster 2",
              image_url: "some image 2",
              description: "some description 2",
              atk: "atk 2",
              def: "def 2",
              effect: "some effect 2",
              main_card: true,
            }),
            new Card({
              name: "some name 3 ",
              number: 3,
              category: "monster 3",
              image_url: "some image 3",
              description: "some description 3",
              atk: "atk 3",
              def: "def 3",
              effect: "some effect 3",
              main_card: true,
            }),
          ],
          main_card: new Card({
            name: "some name 1 ",
            number: 1,
            category: "monster 1",
            image_url: "some image 1",
            description: "some description 1",
            atk: "atk 1",
            def: "def 1",
            effect: "some effect 1",
            main_card: true,
          }),
        }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const itemsFiltered = await repository["applyFilter"](
        items,
        null,
        "name"
      );
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter items", async () => {
      const created_at = new Date();
      const items = [
        new Deck({
          name: "some name",
          user: new User(new BcryptAdapter.HasherAdapter(12), {
            email: "teste@teste.com",
            name: "dale",
            password: "123",
            created_at,
          }),
          cards: [
            new Card({
              name: "some name 1 ",
              number: 1,
              category: "monster 1",
              image_url: "some image 1",
              description: "some description 1",
              atk: "atk 1",
              def: "def 1",
              effect: "some effect 1",
              main_card: true,
              created_at,
            }),
            new Card({
              name: "some name 2 ",
              number: 2,
              category: "monster 2",
              image_url: "some image 2",
              description: "some description 2",
              atk: "atk 2",
              def: "def 2",
              effect: "some effect 2",
              main_card: true,
              created_at,
            }),
          ],
          main_card: new Card({
            name: "some name 2 ",
            number: 2,
            category: "monster 2",
            image_url: "some image 2",
            description: "some description 2",
            atk: "atk 2",
            def: "def 2",
            effect: "some effect 2",
            main_card: true,
            created_at,
          }),
        }),
        new Deck({
          name: "some name 2",
          user: new User(new BcryptAdapter.HasherAdapter(12), {
            email: "teste@teste.com",
            name: "dale",
            password: "123",
            created_at,
          }),
          cards: [
            new Card({
              name: "some name 2 ",
              number: 2,
              category: "monster 2",
              image_url: "some image 2",
              description: "some description 2",
              atk: "atk 2",
              def: "def 2",
              effect: "some effect 2",
              main_card: true,
              created_at,
            }),
            new Card({
              name: "some name 3 ",
              number: 3,
              category: "monster 3",
              image_url: "some image 3",
              description: "some description 3",
              atk: "atk 3",
              def: "def 3",
              effect: "some effect 3",
              main_card: true,
              created_at,
            }),
          ],
          main_card: new Card({
            name: "some name 1 ",
            number: 1,
            category: "monster 1",
            image_url: "some image 1",
            description: "some description 1",
            atk: "atk 1",
            def: "def 1",
            effect: "some effect 1",
            main_card: true,
            created_at,
          }),
        }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const itemsFiltered = await repository["applyFilter"](
        items,
        "some name 2",
        "name"
      );

      expect(itemsFiltered).toHaveLength(1);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      expect(itemsFiltered).toStrictEqual([items[1]]);
    });

    describe("apply method sort", () => {
      it("should sort by created_at when sort params is null", async () => {
        const created_at = new Date();
        const items = [
          new Deck({
            name: "some name",
            user: new User(new BcryptAdapter.HasherAdapter(12), {
              email: "teste@teste.com",
              name: "dale",
              password: "123",
            }),
            cards: [
              new Card({
                name: "some name 1 ",
                number: 1,
                category: "monster 1",
                image_url: "some image 1",
                description: "some description 1",
                atk: "atk 1",
                def: "def 1",
                effect: "some effect 1",
                main_card: true,
              }),
              new Card({
                name: "some name 2 ",
                number: 2,
                category: "monster 2",
                image_url: "some image 2",
                description: "some description 2",
                atk: "atk 2",
                def: "def 2",
                effect: "some effect 2",
                main_card: true,
              }),
            ],
            main_card: new Card({
              name: "some name 2 ",
              number: 2,
              category: "monster 2",
              image_url: "some image 2",
              description: "some description 2",
              atk: "atk 2",
              def: "def 2",
              effect: "some effect 2",
              main_card: true,
            }),
            created_at: new Date(2023, 1, 24, 14, 20),
          }),
          new Deck({
            name: "some name 2",
            user: new User(new BcryptAdapter.HasherAdapter(12), {
              email: "teste@teste.com",
              name: "dale",
              password: "123",
            }),
            cards: [
              new Card({
                name: "some name 2 ",
                number: 2,
                category: "monster 2",
                image_url: "some image 2",
                description: "some description 2",
                atk: "atk 2",
                def: "def 2",
                effect: "some effect 2",
                main_card: true,
              }),
              new Card({
                name: "some name 3 ",
                number: 3,
                category: "monster 3",
                image_url: "some image 3",
                description: "some description 3",
                atk: "atk 3",
                def: "def 3",
                effect: "some effect 3",
                main_card: true,
              }),
            ],
            main_card: new Card({
              name: "some name 1 ",
              number: 1,
              category: "monster 1",
              image_url: "some image 1",
              description: "some description 1",
              atk: "atk 1",
              def: "def 1",
              effect: "some effect 1",
              main_card: true,
            }),
            created_at: new Date(2023, 1, 24, 14, 21),
          }),
        ];
        const itemsSorted = await repository["applySort"](items, null, null);
        expect(itemsSorted).toStrictEqual([items[1], items[0]]);
      });

      it("should sort items by name", async () => {
        const items = [
          new Deck({
            name: "some name 1",
            user: new User(new BcryptAdapter.HasherAdapter(12), {
              email: "teste@teste.com",
              name: "dale",
              password: "123",
            }),
            created_at: new Date(2023, 1, 24, 14, 20),
          }),
          new Deck({
            name: "some name 2",
            user: new User(new BcryptAdapter.HasherAdapter(12), {
              email: "teste@teste.com",
              name: "dale",
              password: "123",
            }),
            created_at: new Date(2023, 1, 24, 14, 21),
          }),
          new Deck({
            name: "some name 3",
            user: new User(new BcryptAdapter.HasherAdapter(12), {
              email: "teste@teste.com",
              name: "dale",
              password: "123",
            }),
            created_at: new Date(2023, 1, 24, 14, 22),
          }),
          new Deck({
            name: "some name 5",
            user: new User(new BcryptAdapter.HasherAdapter(12), {
              email: "teste@teste.com",
              name: "dale",
              password: "123",
            }),
            created_at: new Date(2023, 1, 24, 14, 23),
          }),
          new Deck({
            name: "some name 4",
            user: new User(new BcryptAdapter.HasherAdapter(12), {
              email: "teste@teste.com",
              name: "dale",
              password: "123",
            }),
            created_at: new Date(2023, 1, 24, 14, 24),
          }),
        ];
        let itemsSorted = await repository["applySort"](items, "name", "asc");
        expect(itemsSorted).toStrictEqual([
          items[0],
          items[1],
          items[2],
          items[4],
          items[3],
        ]);
        itemsSorted = await repository["applySort"](items, "name", "desc");
        expect(itemsSorted).toStrictEqual([
          items[3],
          items[4],
          items[2],
          items[1],
          items[0],
        ]);
      });
    });
  });
});
