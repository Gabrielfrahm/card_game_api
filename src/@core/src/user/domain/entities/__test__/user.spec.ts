import { UniqueEntityId } from "#seedwork/domain";
import { Hasher } from "#seedwork/infra";
import { User } from "../user";

class StubHasher implements Hasher {
  async hash(value: string): Promise<string> {
    return await Promise.resolve("hashed_password");
  }
}

describe("User Unit test", () => {
  beforeEach(() => {
    User.validate = jest.fn();
  });

  test("constructor of user", () => {
    const hasher = new StubHasher();
    const props = {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at: new Date(),
    };

    const user = new User(hasher, props);
    expect(User.validate).toHaveBeenCalled();

    expect(user.props).toStrictEqual(props);
  });

  test("id field", () => {
    const hasher = new StubHasher();
    const data = [
      {
        props: {
          email: "test@test.com",
          password: "12346",
          name: "some name",
          created_at: new Date(),
        },
      },
      {
        props: {
          email: "test@test.com",
          password: "12346",
          name: "some name",
          created_at: new Date(),
        },
        id: null,
      },
      {
        props: {
          email: "test@test.com",
          password: "12346",
          name: "some name",
          created_at: new Date(),
        },
        id: undefined,
      },
      {
        props: {
          email: "test@test.com",
          password: "12346",
          name: "some name",
          created_at: new Date(),
        },
        id: new UniqueEntityId(),
      },
    ];

    data.forEach((i) => {
      const user = new User(hasher, i.props, i.id);
      expect(user.id).not.toBeNull();
      expect(user.uniqueEntityId instanceof UniqueEntityId).toBeTruthy();
    });
  });

  test("getter of email field", () => {
    const hasher = new StubHasher();

    const user = new User(hasher, {
      email: "test@test.com",
      password: "12346",
      name: "some name",
      created_at: new Date(),
    });
    expect(user.email).toBe("test@test.com");
  });

  test("getter of email_confirmation field", () => {
    const hasher = new StubHasher();

    const user = new User(hasher, {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at: new Date(),
    });
    expect(user.email_confirmation).toBe(true);
  });

  test("getter of password field", async () => {
    const hasher = new StubHasher();

    const user = new User(hasher, {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at: new Date(),
    });
    await user.setPassword("12346");

    expect(user.password).toBe("hashed_password");
  });

  test("getter of name field", () => {
    const hasher = new StubHasher();
    const user = new User(hasher, {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at: new Date(),
    });
    expect(user.name).toBe("some name");
  });

  test("getter of created_at field", () => {
    const hasher = new StubHasher();

    let user = new User(hasher, {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at: new Date(),
    });

    expect(user.created_at).toBeInstanceOf(Date);
    let created_at = new Date();

    user = new User(hasher, {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at,
    });
    expect(user.created_at).toBe(created_at);
  });
});
