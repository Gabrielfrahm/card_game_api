import { Card } from "#card/domain";
import CardInMemoryRepository from "./card-in-memory.repository";

describe("card in memory repository unit test", () => {
  let repository: CardInMemoryRepository;
  beforeEach(() => (repository = new CardInMemoryRepository()));

  describe("apply filter method", () => {
    it("should no filter items when filter params is null", async () => {
      const items = [
        new Card({
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
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
      const items = [
        new Card({
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
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
          main_card: true,
        }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const itemsFiltered = await repository["applyFilter"](
        items,
        "monster 2",
        "category"
      );
      expect(itemsFiltered).toHaveLength(1);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      expect(itemsFiltered).toStrictEqual([items[1]]);
    });
  });

  describe("apply method sort", () => {
    it("should sort by created_at when sort params is null", async () => {
      const items = [
        new Card({
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
          created_at: new Date(2023, 1, 24, 14, 20),
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
          main_card: true,
          created_at: new Date(2023, 1, 24, 14, 21),
        }),
      ];
      const itemsSorted = await repository["applySort"](items, null, null);
      expect(itemsSorted).toStrictEqual([items[1], items[0]]);
    });

    it("should sort items by name", async () => {
      const items = [
        new Card({
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
          created_at: new Date(2023, 1, 24, 14, 20),
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
          main_card: true,
          created_at: new Date(2023, 1, 24, 14, 21),
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
          main_card: true,
          created_at: new Date(2023, 1, 24, 14, 22),
        }),
        new Card({
          name: "some name 5",
          number: 5,
          category: "monster 5",
          image_url: "some image 5",
          description: "some description 5",
          atk: "atk 5",
          def: "def 5",
          effect: "some effect 5",
          main_card: true,
          created_at: new Date(2023, 1, 24, 14, 24),
        }),
        new Card({
          name: "some name 4",
          number: 4,
          category: "monster 4",
          image_url: "some image 4",
          description: "some description 4",
          atk: "atk 4",
          def: "def 4",
          effect: "some effect 4",
          main_card: true,
          created_at: new Date(2023, 1, 24, 14, 23),
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
