import { UniqueEntityId } from "#seedwork/domain";
import { Match } from "../match";

describe("Match Unit test", () => {
  beforeEach(() => {
    Match.validate = jest.fn();
  });

  test("constructor of match", () => {
    const props = {
      host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
      participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
      status: "in_progress",
      created_at: new Date(),
    };

    const match = new Match(props);
    expect(Match.validate).toHaveBeenCalled();

    expect(match.props).toStrictEqual(props);
  });

  test("id field", () => {
    const data = [
      {
        props: {
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "in_progress",
          created_at: new Date(),
        },
      },
      {
        props: {
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "in_progress",
          created_at: new Date(),
        },
        id: null,
      },
      {
        props: {
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "in_progress",
          created_at: new Date(),
        },
        id: undefined,
      },
      {
        props: {
          host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
          participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
          status: "in_progress",
          created_at: new Date(),
        },
        id: new UniqueEntityId(),
      },
    ];

    data.forEach((i) => {
      const match = new Match(i.props, i.id);
      expect(match.id).not.toBeNull();
      expect(match.uniqueEntityId instanceof UniqueEntityId).toBeTruthy();
    });
  });

  test("getter of host_id field", () => {
    const match = new Match({
      host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
      participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
      status: "in_progress",
      created_at: new Date(),
    });
    expect(match.host_id).toBe("ffd483b1-5ba6-4fb7-a876-be31f0287e4b");
  });

  test("getter of participant_id field", () => {
    const match = new Match({
      host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
      participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
      status: "in_progress",
      created_at: new Date(),
    });
    expect(match.participant_id).toBe("c6f2e42b-fb49-4429-a3d8-31bc62d73af3");
  });

  test("getter of status field", () => {
    const match = new Match({
      host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
      participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
      status: "finished",
      created_at: new Date(),
    });
    expect(match.status).toBe("finished");
  });

  test("getter of created_at field", () => {
    let match = new Match({
      host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
      participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
      status: "finished",
      created_at: new Date(),
    });

    expect(match.created_at).toBeInstanceOf(Date);
    let created_at = new Date();

    match = new Match({
      host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
      participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
      status: "finished",
      created_at,
    });
    expect(match.created_at).toBe(created_at);
  });

  test("join participant at match", () => {
    let match = new Match({
      host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
      status: "awaiting_players",
      created_at: new Date(),
    });

    expect(match.participant_id).toBe(undefined);

    match.join("c6f2e42b-fb49-4429-a3d8-31bc62d73af3");

    expect(match.participant_id).toBe("c6f2e42b-fb49-4429-a3d8-31bc62d73af3");
  });

  test("change status the match", () => {
    let match = new Match({
      host_id: "ffd483b1-5ba6-4fb7-a876-be31f0287e4b",
      participant_id: "c6f2e42b-fb49-4429-a3d8-31bc62d73af3",
      status: "in_progress",
      created_at: new Date(),
    });

    match.changeStatus("finished");

    expect(match.status).toBe("finished");
  });
});
