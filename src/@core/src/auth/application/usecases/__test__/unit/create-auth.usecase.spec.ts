import { BcryptAdapter } from "#seedwork/infra";
import { UserInMemoryRepository } from "#user/infra";
import { JWTAdapter } from "../../../../infra";
import { CreateAuthUseCase } from "../../create-auth.usecase";
import { User } from "#user/domain";

describe("create user use case unit test", () => {
  let repository: UserInMemoryRepository;
  let useCase: CreateAuthUseCase.UseCase;
  let compareHasher = new BcryptAdapter.CompareAdapter();
  let jwtAdapter = new JWTAdapter(process.env.JWT_SECRET);

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new CreateAuthUseCase.UseCase(
      repository,
      compareHasher,
      jwtAdapter
    );
  });

  it("should create a authentication", async () => {
    const entity = new User(new BcryptAdapter.HasherAdapter(12), {
      email: "some@email.com",
      name: "some name",
      password: "some password",
      created_at: new Date(),
    });
    await entity.setPassword(entity.password);
    await repository.insert(entity);
    let output = await useCase.execute({
      email: entity.email,
      password: "some password",
    });

    expect(output).toStrictEqual({
      user: {
        id: entity.id,
        email: "some@email.com",
        name: "some name",
        email_confirmation: false,
      },
      token: output.token,
    });
  });
});
