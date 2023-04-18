import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { User, UserRepository } from "#user/domain";
import { PrismaClient } from "@prisma/client";
import { UserModelMapper } from "./user-model.mapper";

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ["email", "name", "created_at"];

  constructor(private userModel: PrismaClient) {}

  async insert(entity: User): Promise<void> {
    const userExits = await this.userModel.user.findUnique({
      where: {
        email: entity.email,
      },
    });

    if (userExits) {
      throw new Error("user already existing");
    }

    await this.userModel.user.create({
      data: {
        id: entity.id,
        email: entity.email,
        email_confirmation: entity.email_confirmation,
        name: entity.name,
        password: entity.password,
        created_at: entity.created_at,
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
  }

  async findById(id: string | UniqueEntityId): Promise<User> {
    const _id = `${id}`;
    const model = await this._get(_id);
    if (model) {
      return UserModelMapper.toEntity(model);
    }
  }

  async findAll(): Promise<User[]> {
    const models = await this.userModel.user.findMany({
      select: {
        id: true,
        email: true,
        email_confirmation: true,
        name: true,
        password: true,
        created_at: true,
        updated_at: true,
      },
    });
    return models.map((item) => UserModelMapper.toEntity(item));
  }

  async update(entity: User): Promise<void> {
    const user = await this._get(entity.id);
    if (user) {
      await this.userModel.user.update({
        where: { id: entity.id },
        data: {
          email: entity.email,
          email_confirmation: entity.email_confirmation,
          name: entity.name,
          password: entity.password,
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
    }
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`;
    await this._get(_id);
    await this.userModel.user.delete({ where: { id: _id } });
  }

  async search(
    props: UserRepository.SearchParams
  ): Promise<UserRepository.UserSearchResult> {
    const skip = (props.page - 1) * props.per_page;
    const take = props.per_page;

    const users = await this.userModel.user.findMany({
      ...(props.filter && {
        where: {
          [props.column]: {
            contains: props.filter,
          },
        },
      }),
      orderBy: {
        [props.sort ?? "created_at"]: props.sort_dir ?? "desc",
      },
      select: {
        id: true,
        email: true,
        email_confirmation: true,
        name: true,
        password: true,
        created_at: true,
      },
      take: take,
      skip: skip,
    });

    return new UserRepository.UserSearchResult({
      items: users.map((item) => UserModelMapper.toEntity(item)),
      current_page: props.page,
      per_page: props.per_page,
      total: users.length,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir,
      column: props.column,
    });
  }

  private async _get(id: string) {
    const user = await this.userModel.user.findFirst({
      where: {
        id: id,
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

    if (!user) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return user;
  }
}
