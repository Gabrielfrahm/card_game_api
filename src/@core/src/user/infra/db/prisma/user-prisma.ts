import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { User, UserRepository } from "#user/domain";
import { PrismaClient } from "@prisma/client";
import { UserModelMapper } from "./user-model.mapper";

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ["email", "name", "created_at"];

  constructor(private userModel: PrismaClient) {}

  async insert(entity: User): Promise<void> {
    await this.userModel.user.create({
      data: {
        id: entity.id,
        email: entity.email,
        email_confirmation: entity.email_confirmation,
        name: entity.name,
        password: entity.password,
        created_at: entity.created_at,
      },
    });
  }

  async findById(id: string | UniqueEntityId): Promise<User> {
    const _id = `${id}`;
    const model = await this._get(_id);

    return UserModelMapper.toEntity(model);
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
    await this._get(entity.id);
    await this.userModel.user.update({
      where: { id: entity.id },
      data: {
        email: entity.email,
        email_confirmation: entity.email_confirmation,
        name: entity.name,
        password: entity.password,
      },
    });
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
    console.log(skip);
    const user = await this.userModel.user.findMany({
      ...(props.filter && {
        where: {
          [props.column]: {
            contains: props.filter,
            mode: "insensitive",
          },
        },
      }),
      orderBy: {
        [props.sort ?? "created_at"]: props.sort_dir ?? "desc",
      },
      take: take,
      skip: skip,
    });

    console.log(user);
    throw new Error(`not implemented`);
  }

  private async _get(id: string) {
    const user = await this.userModel.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return user;
  }
}
