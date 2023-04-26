import { UserPrismaRepository } from "../user-prisma";

import { User, UserRepository } from "#user/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { UserModelMapper } from "../user-model.mapper";
import { BcryptAdapter, prismaClient } from "#seedwork/infra";

describe("user prisma unit test", () => {
  let repository: UserPrismaRepository;

  beforeEach(async () => {
    repository = new UserPrismaRepository(prismaClient);
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("Should be inserts a user", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);
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
    console.log(model.id);
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
    const hasher = new BcryptAdapter.HasherAdapter(12);

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

  it("should finds a entity by email", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);

    let user = new User(hasher, {
      email: "test@mail.com",
      name: "some name",
      password: "some password",
    });
    await repository.insert(user);

    let entityFound = await repository.findByEmail(user.email);

    expect(user.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all  users", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);

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
    const hasher = new BcryptAdapter.HasherAdapter(12);

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
    const hasher = new BcryptAdapter.HasherAdapter(12);

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
    const hasher = new BcryptAdapter.HasherAdapter(12);

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

  describe("search method test", () => {
    it("should only apply paginate when other params are null ", async () => {
      const created_at = new Date();
      const hasher = new BcryptAdapter.HasherAdapter(12);

      let entity = new User(hasher, {
        email: "test@mail.com",
        name: "some name",
        password: "some password",
        created_at: created_at,
      });
      await repository.insert(entity);
      entity = new User(hasher, {
        email: "test2@mail.com",
        name: "some name",
        password: "some password",
        created_at: created_at,
      });
      await repository.insert(entity);
      entity = new User(hasher, {
        email: "test3@mail.com",
        name: "some name",
        password: "some password",
        created_at: created_at,
      });
      await repository.insert(entity);
      entity = new User(hasher, {
        email: "test4@test3.com",
        name: "some name",
        password: "some password",
        created_at: created_at,
      });
      await repository.insert(entity);

      const spyToEntity = jest.spyOn(UserModelMapper, "toEntity");

      const searchOutput = await repository.search(
        new UserRepository.SearchParams({})
      );

      expect(searchOutput).toBeInstanceOf(UserRepository.UserSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(4);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 4,
        current_page: 1,
        last_page: 1,
        per_page: 10,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(User);
        expect(item.id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(4).fill({
          email_confirmation: false,
          name: "some name",
          password: "some password",
          created_at: created_at,
        })
      );
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      const hasher = new BcryptAdapter.HasherAdapter(12);

      const arrange = [
        new User(hasher, {
          email: "test@mail.com",
          name: "name0",
          password: "some password",
          created_at: created_at,
        }),
        new User(hasher, {
          email: "test2@mail.com",
          name: "name1",
          password: "some password",
          created_at: created_at,
        }),
        new User(hasher, {
          email: "test3@mail.com",
          name: "name2",
          password: "some password",
          created_at: created_at,
        }),
      ];

      await prismaClient.user.create({
        data: {
          email: arrange[0].email,
          email_confirmation: arrange[0].email_confirmation,
          name: arrange[0].name,
          password: arrange[0].password,
          created_at: created_at,
        },
      });

      await prismaClient.user.create({
        data: {
          email: arrange[1].email,
          email_confirmation: arrange[1].email_confirmation,
          name: arrange[1].name,
          password: arrange[1].password,
          created_at: created_at,
        },
      });

      await prismaClient.user.create({
        data: {
          email: arrange[2].email,
          email_confirmation: arrange[2].email_confirmation,
          name: arrange[2].name,
          password: arrange[2].password,
          created_at: created_at,
        },
      });

      const searchOutput = await repository.search(
        new UserRepository.SearchParams()
      );
      searchOutput.items.reverse().forEach((item) => {
        expect(`${item.name}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const defaultProps = {
        password: "some password",
        created_at: new Date(),
      };

      const userProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          email: "test@mail.com",
          name: "test",
          ...defaultProps,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          email: "B@mail.com",
          name: "B",
          ...defaultProps,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          email: "movie@mail.com",
          name: "Movie",
          ...defaultProps,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          email: "movie2@mail.com",
          name: "Movie",
          ...defaultProps,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          email: "movie3@mail.com",
          name: "MOVIE",
          ...defaultProps,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          email: "movie4@mail.com",
          name: "mOvIe",
          ...defaultProps,
        },
      ];

      let arrayUser = [];
      for (let users of userProps) {
        const user = await prismaClient.user.create({
          data: {
            id: users.id,
            email: users.email,
            name: users.name,
            password: users.password,
            email_confirmation: false,
          },
          select: {
            id: true,
            email: true,
            email_confirmation: true,
            name: true,
            password: true,
            created_at: true,
          },
        });
        arrayUser.push(user);
      }

      let result = await repository.search(
        new UserRepository.SearchParams({
          page: 1,
          per_page: 2,
          column: "name",
          filter: "MOVIE",
        })
      );

      expect(JSON.stringify(result.toJSON(true))).toMatch(
        JSON.stringify(
          new UserRepository.UserSearchResult({
            items: [
              UserModelMapper.toEntity(arrayUser[5]),
              UserModelMapper.toEntity(arrayUser[4]),
            ],
            total: 2,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: "MOVIE",
            column: "name",
          }).toJSON(true)
        )
      );

      result = await repository.search(
        new UserRepository.SearchParams({
          page: 2,
          per_page: 2,
          filter: "MOVIE",
          column: "name",
        })
      );
      expect(JSON.stringify(result.toJSON(true))).toMatch(
        JSON.stringify(
          new UserRepository.UserSearchResult({
            items: [
              UserModelMapper.toEntity(arrayUser[3]),
              UserModelMapper.toEntity(arrayUser[2]),
            ],
            total: 2,
            current_page: 2,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: "MOVIE",
            column: "name",
          }).toJSON(true)
        )
      );
    });

    it("should apply paginate and sort", async () => {
      const defaultProps = {
        password: "some password",
        created_at: new Date(),
      };

      const userProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          email: "test@mail.com",
          name: "b",
          ...defaultProps,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          email: "B@mail.com",
          name: "a",
          ...defaultProps,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          email: "movie@mail.com",
          name: "c",
          ...defaultProps,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          email: "movie2@mail.com",
          name: "e",
          ...defaultProps,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          email: "movie3@mail.com",
          name: "d",
          ...defaultProps,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          email: "movie4@mail.com",
          name: "f",
          ...defaultProps,
        },
      ];

      let arrayUser = [];
      for (let users of userProps) {
        const user = await prismaClient.user.create({
          data: {
            id: users.id,
            email: users.email,
            name: users.name,
            password: users.password,
            email_confirmation: false,
          },
          select: {
            id: true,
            email: true,
            email_confirmation: true,
            name: true,
            password: true,
            created_at: true,
          },
        });
        arrayUser.push(user);
      }

      const arrange = [
        {
          params: new UserRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new UserRepository.UserSearchResult({
            items: [
              UserModelMapper.toEntity(arrayUser[1]),
              UserModelMapper.toEntity(arrayUser[0]),
            ],
            per_page: 2,
            current_page: 1,
            total: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new UserRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new UserRepository.UserSearchResult({
            items: [
              UserModelMapper.toEntity(arrayUser[2]),
              UserModelMapper.toEntity(arrayUser[4]),
            ],
            per_page: 2,
            current_page: 2,
            total: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new UserRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new UserRepository.UserSearchResult({
            items: [
              UserModelMapper.toEntity(arrayUser[5]),
              UserModelMapper.toEntity(arrayUser[3]),
            ],
            per_page: 2,
            current_page: 1,
            total: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
            column: null,
          }),
        },
        {
          params: new UserRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new UserRepository.UserSearchResult({
            items: [
              UserModelMapper.toEntity(arrayUser[4]),
              UserModelMapper.toEntity(arrayUser[2]),
            ],
            per_page: 2,
            current_page: 2,
            total: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
            column: null,
          }),
        },
      ];

      for (const item of arrange) {
        let result = await repository.search(item.params);

        expect(JSON.stringify(result.toJSON(true))).toMatch(
          JSON.stringify(item.result.toJSON(true))
        );
      }
    });

    it("should search using filter, sort and paginate", async () => {
      const defaultProps = {
        password: "some password",
        created_at: new Date(),
      };

      const userProps = [
        {
          id: "0d2d9aba-cc11-412e-aa2e-358bca445cb2",
          email: "test@mail.com",
          name: "test",
          ...defaultProps,
        },
        {
          id: "985f9375-1c60-4365-81f3-c26e497995ea",
          email: "B@mail.com",
          name: "FAKE",
          ...defaultProps,
        },
        {
          id: "362ebdb3-cbfb-4f1b-9dde-d1d411dcd7d9",
          email: "movie@mail.com",
          name: "some name",
          ...defaultProps,
        },
        {
          id: "8e6cf50b-7ec1-457e-a698-1552c6b60809",
          email: "movie2@mail.com",
          name: "a",
          ...defaultProps,
        },
        {
          id: "d1fbfc19-2eff-4833-b18c-8851ad4fce09",
          email: "movie3@mail.com",
          name: "fake",
          ...defaultProps,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520",
          email: "movie4@mail.com",
          name: "TEST",
          ...defaultProps,
        },
        {
          id: "bcfc9d83-f5cf-4e64-8d4f-709f9bcdc528",
          email: "movie5@mail.com",
          name: "Test",
          ...defaultProps,
        },
      ];

      let arrayUser = [];
      for (let users of userProps) {
        const user = await prismaClient.user.create({
          data: {
            id: users.id,
            email: users.email,
            name: users.name,
            password: users.password,
            email_confirmation: false,
          },
          select: {
            id: true,
            email: true,
            email_confirmation: true,
            name: true,
            password: true,
            created_at: true,
          },
        });
        arrayUser.push(user);
      }

      const arrange = [
        {
          params: new UserRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
            column: "name",
          }),
          result: new UserRepository.UserSearchResult({
            items: [
              UserModelMapper.toEntity(arrayUser[5]),
              UserModelMapper.toEntity(arrayUser[6]),
            ],
            per_page: 2,
            current_page: 1,
            total: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
            column: "name",
          }),
        },
        {
          params: new UserRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "FAKE",
            column: "name",
          }),
          result: new UserRepository.UserSearchResult({
            items: [
              UserModelMapper.toEntity(arrayUser[1]),
              UserModelMapper.toEntity(arrayUser[4]),
            ],
            per_page: 2,
            current_page: 1,
            total: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "FAKE",
            column: "name",
          }),
        },
      ];
      for (const item of arrange) {
        let result = await repository.search(item.params);
        expect(JSON.stringify(result.toJSON(true))).toMatch(
          JSON.stringify(item.result.toJSON(true))
        );
      }
    });
  });
});
