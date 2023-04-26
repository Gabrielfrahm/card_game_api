import { NotFoundError } from "#seedwork/domain";
import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";
import { UserInMemoryRepository } from "#user/infra";
import UpdateUserUseCase from "../../update-user.usecase";

describe("update user use case unit test", () => {
  let repository: UserInMemoryRepository;
  let useCase: UpdateUserUseCase.UseCase;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new UpdateUserUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID fake id`)
    );
  });

  it("should update a user", async () => {
    const spyRepository = jest.spyOn(repository, "update");
    const hasher = new BcryptAdapter.HasherAdapter(12);
    const entity = new User(hasher, {
      email: "some@email.com",
      name: "some name",
      password: "some password",
      created_at: new Date(),
    });
    await entity.setPassword(entity.password);

    repository.items = [entity];
    let output = await useCase.execute({ id: entity.id, name: "test" });

    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      email: entity.email,
      email_confirmation: false,
      name: "test",
      password: entity.password,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        email?: string;
        email_confirmation?: boolean;
        name?: string;
        password?: string;
      };
      expected: {
        id: string;
        email: string;
        email_confirmation: boolean;
        name: string;
        password: string;
        created_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id,
          email: "test@test.com",
          name: "some name",
          password: "some password",
        },
        expected: {
          id: entity.id,
          email: "test@test.com",
          email_confirmation: false,
          name: "some name",
          password: "some password",
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          email: "test@test.com",
          email_confirmation: true,
          name: "some name",
          password: "some password",
        },
        expected: {
          id: entity.id,
          email: "test@test.com",
          email_confirmation: true,
          name: "some name",
          password: "some password",
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        email: i.input.email,
        email_confirmation: i.input.email_confirmation,
        name: i.input.name,
        password: i.input.password,
      });
      expect(output).toStrictEqual({
        id: entity.id,
        email: i.expected.email,
        email_confirmation: i.expected.email_confirmation,
        name: i.expected.name,
        password: output.password,
        created_at: i.expected.created_at,
      });
    }
  });
});
