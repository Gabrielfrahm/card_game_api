import { PrismaClient } from "@prisma/client";
import { UserPrismaRepository } from "../user-prisma";
import { BcryptAdapter } from "#user/infra/cryptography";
import { User, UserRepository } from "#user/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";

describe("user prisma unit test", () => {
  let prismaClient = new PrismaClient();
  let repository: UserPrismaRepository;
  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
  });
  afterAll(() => prismaClient.user.deleteMany());

  it("Should be inserts a user", async () => {
    const hasher = new BcryptAdapter(12);
    let user = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await user.setPassword("some name");
    await repository.insert(user);
    let model = await prismaClient.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(user.toJSON()).toStrictEqual({
      id: model.id,
      email: model.email,
      email_confirmation: model.email_confirmation,
      name: model.name,
      password: model.password,
      created_at: model.created_at,
    });
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );
    const uuid = new UniqueEntityId();
    await expect(repository.findById(uuid)).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID ${uuid}`)
    );
  });

  it("should finds a entity by id", async () => {
    const hasher = new BcryptAdapter(12);
    let user = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await repository.insert(user);

    let entityFound = await repository.findById(user.id);
    expect(user.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(user.uniqueEntityId);
    expect(user.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all  categories", async () => {
    const hasher = new BcryptAdapter(12);
    let user = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await repository.insert(user);
    const entities = await repository.findAll();

    expect(entities).toHaveLength(1);
  });

  it("should return on error when a entity not found", async () => {
    const hasher = new BcryptAdapter(12);
    let entity = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID ${entity.uniqueEntityId}`)
    );
  });

  it("should update entity", async () => {
    const hasher = new BcryptAdapter(12);
    let entity = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await repository.insert(entity);

    entity.update({ name: "update" });
    await repository.update(entity);
    let foundCategory = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(foundCategory.toJSON());
  });

  it("should throw error on delete when a entity not found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found Using ID fake id")
    );

    await expect(
      repository.delete(
        new UniqueEntityId("b868db19-24cd-45e2-b527-8b7b16c0463b")
      )
    ).rejects.toThrow(
      new NotFoundError(
        "Entity Not Found Using ID b868db19-24cd-45e2-b527-8b7b16c0463b"
      )
    );
  });

  it("should delete an entity", async () => {
    const hasher = new BcryptAdapter(12);
    let entity = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await repository.insert(entity);

    await repository.delete(entity.id);
    const entityFound = await prismaClient.user.findUnique({
      where: { id: entity.id },
    });

    expect(entityFound).toBeNull();
  });

  it("should search ", async () => {
    const hasher = new BcryptAdapter(12);
    let entity = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
      created_at: new Date(2023, 1, 24, 14, 20),
    });

    await repository.insert(entity);
    entity = new User(hasher, {
      email: "test2@mail.com",
      name: "some name",
      password: "some password",
      created_at: new Date(2023, 1, 24, 14, 21),
    });

    await repository.insert(entity);
    entity = new User(hasher, {
      email: "test3@mail.com",
      name: "some name",
      password: "some password",
      created_at: new Date(2023, 1, 24, 14, 22),
    });
    await repository.insert(entity);

    const dale = await repository.search(
      new UserRepository.SearchParams({
        per_page: 2,
        page: 2,
      })
    );
    console.log(dale);
  });
});
