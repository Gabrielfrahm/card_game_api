import { Match } from "#match/domain";
import MatchInMemoryRepository from "./match-in-memory.repository";

describe("match in memory repository unit test", () => {
  let repository: MatchInMemoryRepository;
  beforeEach(() => (repository = new MatchInMemoryRepository()));

  describe("apply filter method", () => {
    it("should no filter items when filter params is null", async () => {
      const items = [
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "in_progress",
          created_at: new Date(),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "finished",
          created_at: new Date(),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          status: "awaiting_players",
          created_at: new Date(),
        }),
      ];

      const spyFilterMethod = jest.spyOn(items, "filter");
      const itemsFiltered = await repository["applyFilter"](
        items,
        null,
        "host_id"
      );
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter items", async () => {
      const items = [
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "in_progress",
          created_at: new Date(),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "finished",
          created_at: new Date(),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          status: "awaiting_players",
          created_at: new Date(),
        }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      let itemsFiltered = await repository["applyFilter"](
        items,
        "finished",
        "status"
      );
      expect(itemsFiltered).toHaveLength(1);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      expect(itemsFiltered).toStrictEqual([items[1]]);

      itemsFiltered = await repository["applyFilter"](
        items,
        "awaiting_players",
        "status"
      );
      expect(itemsFiltered).toHaveLength(1);
    });
  });

  describe("apply method sort", () => {
    it("should sort by created_at when sort params is null", async () => {
      const items = [
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "finished",
          created_at: new Date(2023, 1, 24, 14, 20),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "finished",
          created_at: new Date(2023, 1, 24, 14, 21),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "finished",
          created_at: new Date(2023, 1, 24, 14, 22),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "finished",
          created_at: new Date(2023, 1, 24, 14, 23),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "finished",
          created_at: new Date(2023, 1, 24, 14, 24),
        }),
        new Match({
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "finished",
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
  });
});
