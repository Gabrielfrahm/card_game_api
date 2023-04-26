import { NotFoundError } from "#seedwork/domain";
import { Auth, PrismaClient } from "@prisma/client";

export type AuthEntityPrisma = {
  id?: string;
  token: string;
  user_id: string;
};

export class AuthPrismaRepository {
  constructor(private model: PrismaClient) {}

  async insert(entity: AuthEntityPrisma): Promise<void> {
    await this._get(entity.user_id);
    const auth = await this._getAuth(entity.user_id);

    if (auth) {
      await this.model.auth.delete({
        where: {
          id: auth.id,
        },
      });
    }

    await this.model.auth.create({
      data: {
        id: entity.id,
        user_id: entity.user_id,
        token: entity.token,
      },
      select: {
        id: true,
        user: true,
        token: true,
        user_id: true,
        created_at: true,
      },
    });
  }

  async findById(user_id: string): Promise<Auth> {
    const model = await this._getAuthUserId(user_id);
    if (model) {
      return model;
    }
  }

  private async _getAuth(id: string) {
    const auth = await this.model.auth.findFirst({
      where: {
        user_id: id,
      },
      select: {
        id: true,
        user: true,
        token: true,
        user_id: true,
        created_at: true,
      },
    });

    return auth;
  }

  private async _getAuthUserId(user_id: string) {
    const auth = await this.model.auth.findFirst({
      where: {
        user_id: user_id,
      },
      select: {
        id: true,
        user: true,
        token: true,
        user_id: true,
        updated_at: true,
        created_at: true,
      },
    });

    if (!auth) {
      throw new NotFoundError(`Entity Not Found Using ID ${user_id}`);
    }
    return auth;
  }

  private async _get(id: string) {
    const user = await this.model.user.findFirst({
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
        auths: true,
      },
    });

    if (!user) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return user;
  }
}
