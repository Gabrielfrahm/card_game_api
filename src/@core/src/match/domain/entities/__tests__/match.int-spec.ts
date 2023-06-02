import { Match } from "../match";

describe("Match Integration test", () => {
  describe("created method", () => {
    it("should a invalid match using host_id property", async () => {
      expect(
        () =>
          new Match({
            host_id: null,
            participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
            status: "in_progress",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        host_id: ["host_id should not be empty", "host_id must be a string"],
      });

      expect(
        () =>
          new Match({
            host_id: "",
            participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
            status: "in_progress",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        host_id: ["host_id should not be empty"],
      });

      expect(
        () =>
          new Match({
            host_id: 5 as any,
            participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
            status: "in_progress",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        host_id: ["host_id must be a string"],
      });
    });

    it("should a invalid match using participant_id property", async () => {
      expect(
        () =>
          new Match({
            host_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
            participant_id: false as any,
            status: "in_progress",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        participant_id: ["participant_id must be a string"],
      });

      expect(
        () =>
          new Match({
            host_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
            participant_id: 5 as any,
            status: "in_progress",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        participant_id: ["participant_id must be a string"],
      });
    });

    it("should a invalid match using status property", async () => {
      expect(
        () =>
          new Match({
            host_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
            status: false as any,
            created_at: new Date(),
          })
      ).containsErrorMessages({
        status: ["status must be a string"],
      });

      expect(
        () =>
          new Match({
            host_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
            status: 5 as any,
            created_at: new Date(),
          })
      ).containsErrorMessages({
        status: ["status must be a string"],
      });
    });

    it("should a valid match", async () => {
      new Match({
        host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
        participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
        status: "in_progress",
        created_at: new Date(),
      });

      new Match({
        host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
        status: "awaiting_players",
        created_at: new Date(),
      });

      new Match({
        host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
        participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
        status: "finished",
        created_at: new Date(),
      });

      const match = new Match({
        host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
        participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
        status: "in_progress",
        created_at: new Date(),
      });

      match.changeStatus("finished");
      expect(match.status).toBe("finished");
    });
  });
});
