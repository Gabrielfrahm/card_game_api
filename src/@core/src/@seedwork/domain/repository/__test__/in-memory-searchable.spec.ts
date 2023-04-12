import { Entity } from "#seedwork/domain/entity";
import { InMemorySearchableRepository } from "../in-memory.repository";
import { SearchParams, SearchResult } from "../repository-contracts";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ["name"];
  protected async applyFilter(
    items: StubEntity[],
    filter: string
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.props.name
          .toLocaleLowerCase()
          .includes(filter.toLocaleLowerCase()) ||
        item.props.price.toString() === filter
      );
    });
  }
}

describe("InMemorySearchableRepository", () => {
  let repository: StubInMemorySearchableRepository;
  beforeEach(() => (repository = new StubInMemorySearchableRepository()));

  describe("Apply Filter method", () => {
    it("should no filter items when filter param is null", async () => {
      const items = [new StubEntity({ name: "Some name", price: 5 })];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const itemsFiltered = await repository["applyFilter"](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const items = [
        new StubEntity({ name: "Some name", price: 5 }),
        new StubEntity({ name: "Fake name", price: 2 }),
        new StubEntity({ name: "Some name Test", price: 10 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      let itemsFiltered = await repository["applyFilter"](items, "Some name");
      expect(itemsFiltered).toStrictEqual([items[0], items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await repository["applyFilter"](items, "5");
      expect(itemsFiltered).toStrictEqual([items[0]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await repository["applyFilter"](items, "non-filter");
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe("Apply sort method", () => {
    it("should no sort items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 2 }),
      ];

      let itemsSorted = await repository["applySort"](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repository["applySort"](items, "price", "asc");
      expect(itemsSorted).toStrictEqual(items);
    });

    it("should sort items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 2 }),
        new StubEntity({ name: "c", price: 2 }),
      ];
      let itemsSorted = await repository["applySort"](items, "name", "asc");

      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await repository["applySort"](items, "name", "desc");

      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });
  describe("Apply paginate method", () => {
    it("should paginate items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 2 }),
        new StubEntity({ name: "c", price: 2 }),
        new StubEntity({ name: "d", price: 2 }),
        new StubEntity({ name: "f", price: 2 }),
        new StubEntity({ name: "e", price: 2 }),
      ];
      let itemsPaginate = await repository["applyPaginate"](items, 1, 2);
      expect(itemsPaginate).toStrictEqual([items[0], items[1]]);

      itemsPaginate = await repository["applyPaginate"](items, 2, 2);
      expect(itemsPaginate).toStrictEqual([items[2], items[3]]);

      itemsPaginate = await repository["applyPaginate"](items, 3, 2);
      expect(itemsPaginate).toStrictEqual([items[4], items[5]]);

      itemsPaginate = await repository["applyPaginate"](items, 4, 2);
      expect(itemsPaginate).toStrictEqual([]);
    });
  });
  describe("search method", () => {
    it("should  apply only paginate when other params are null", async () => {
      const entity = new StubEntity({ name: "some name", price: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;
      const result = new SearchResult({
        items: Array(15).fill(entity),
        per_page: 15,
        current_page: 1,
        total: 16,
        sort: null,
        sort_dir: null,
        filter: null,
        column: null,
      });
    });
    it("should  apply paginate and filter", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "FAKE", price: 2 }),
        new StubEntity({ name: "some name", price: 2 }),
        new StubEntity({ name: "a", price: 2 }),
        new StubEntity({ name: "fake", price: 2 }),
        new StubEntity({ name: "TEST", price: 2 }),
        new StubEntity({ name: "TeSt", price: 2 }),
      ];

      repository.items = items;
      let result = await repository.search(
        new SearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST",
          column: "name",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[5]],
          per_page: 2,
          current_page: 1,
          total: 3,
          sort: null,
          sort_dir: null,
          filter: "TEST",
          column: "name",
        })
      );
      result = await repository.search(
        new SearchParams({
          page: 2,
          per_page: 2,
          filter: "TEST",
          column: "name",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[6]],
          per_page: 2,
          current_page: 2,
          total: 3,
          sort: null,
          sort_dir: null,
          filter: "TEST",
          column: "name",
        })
      );
    });

    it("should apply paginate and sort", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 2 }),
        new StubEntity({ name: "c", price: 2 }),
        new StubEntity({ name: "e", price: 2 }),
        new StubEntity({ name: "d", price: 2 }),
        new StubEntity({ name: "f", price: 2 }),
      ];
      repository.items = items;
      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new SearchResult({
            items: [items[1], items[0]],
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
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new SearchResult({
            items: [items[2], items[4]],
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
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new SearchResult({
            items: [items[5], items[3]],
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
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new SearchResult({
            items: [items[4], items[2]],
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
        let result = await repository.search(item.params);
        expect(result).toStrictEqual(item.result);
      }
    });

    it("should search using filter, sort and paginate", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "FAKE", price: 2 }),
        new StubEntity({ name: "some name", price: 2 }),
        new StubEntity({ name: "a", price: 2 }),
        new StubEntity({ name: "fake", price: 2 }),
        new StubEntity({ name: "TEST", price: 2 }),
        new StubEntity({ name: "TeSt", price: 2 }),
      ];
      repository.items = items;
      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
            column: "name",
          }),
          result: new SearchResult({
            items: [items[5], items[6]],
            per_page: 2,
            current_page: 1,
            total: 3,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
            column: "name",
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "TEST",
            column: "name",
          }),
          result: new SearchResult({
            items: [items[0]],
            per_page: 2,
            current_page: 2,
            total: 3,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
            column: "name",
          }),
        },
      ];
      for (const item of arrange) {
        let result = await repository.search(item.params);
        expect(result).toStrictEqual(item.result);
      }
    });
  });
});
