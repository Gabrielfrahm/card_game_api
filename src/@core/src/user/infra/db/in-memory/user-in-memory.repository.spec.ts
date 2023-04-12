import { User } from "#user/domain";
import { BcryptAdapter } from "#user/infra/cryptography";
import UserInMemoryRepository from "./user-in-memory.repository";

describe("user in memory repository unit test", () => {
  let repository: UserInMemoryRepository;
  beforeEach(() => (repository = new UserInMemoryRepository()));

  describe("apply filter method", () => {
    it("should no filter items when filter params is null", async () => {
      const hasher = new BcryptAdapter(12);
      const items = [
        new User(hasher, {
          email: "some@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(),
        }),
        new User(hasher, {
          email: "some2@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(),
        }),
        new User(hasher, {
          email: "some3@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(),
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
      const hasher = new BcryptAdapter(12);
      const items = [
        new User(hasher, {
          email: "some@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(),
        }),
        new User(hasher, {
          email: "some3@email.com",
          name: "some different name",
          password: "123",
          created_at: new Date(),
        }),
        new User(hasher, {
          email: "some2@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(),
        }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      let itemsFiltered = await repository["applyFilter"](
        items,
        "some name",
        "name"
      );
      expect(itemsFiltered).toHaveLength(2);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      expect(itemsFiltered).toStrictEqual([items[0], items[2]]);

      itemsFiltered = await repository["applyFilter"](
        items,
        "some@email.com",
        "email"
      );
      expect(itemsFiltered).toHaveLength(1);
    });
  });

  describe("apply method sort", () => {
    it("should sort by created_at when sort params is null", async () => {
      const hasher = new BcryptAdapter(12);
      const items = [
        new User(hasher, {
          email: "some@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(2023, 1, 24, 14, 20),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(2023, 1, 24, 14, 21),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(2023, 1, 24, 14, 22),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(2023, 1, 24, 14, 23),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(2023, 1, 24, 14, 24),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "some name",
          password: "123",
          created_at: new Date(2023, 1, 24, 14, 25),
        }),
      ];
      const itemsSorted = await repository["applySort"](items, null, null);
      expect(itemsSorted).toStrictEqual([
        items[5],
        items[4],
        items[3],
        items[2],
        items[1],
        items[0],
      ]);
    });

    it("should sort items by name", async () => {
      const hasher = new BcryptAdapter(12);
      const items = [
        new User(hasher, {
          email: "some@email.com",
          name: "Pedro",
          password: "123",
          created_at: new Date(),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "Gabriel",
          password: "123",
          created_at: new Date(),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "Fernandes",
          password: "123",
          created_at: new Date(),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "Mario",
          password: "123",
          created_at: new Date(),
        }),
        new User(hasher, {
          email: "some@email.com",
          name: "GaBrIeL",
          password: "123",
          created_at: new Date(),
        }),
      ];
      let itemsSorted = await repository["applySort"](items, "name", "asc");
      expect(itemsSorted).toStrictEqual([
        items[2],
        items[4],
        items[1],
        items[3],
        items[0],
      ]);

      itemsSorted = await repository["applySort"](items, "name", "desc");
      expect(itemsSorted).toStrictEqual([
        items[0],
        items[3],
        items[1],
        items[4],
        items[2],
      ]);
      itemsSorted = await repository["applySort"](items, "name", "desc");
      expect(itemsSorted).toStrictEqual([
        items[0],
        items[3],
        items[1],
        items[4],
        items[2],
      ]);
    });
  });
});
