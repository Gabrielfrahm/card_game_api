import { EntityValidationError, UniqueEntityId } from "#seedwork/domain";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { User as Entity } from "#user/domain";
import { BcryptAdapter } from "#user/infra/cryptography";
import { User } from "@prisma/client";

export class UserModelMapper {
  static toEntity(model: Omit<User, "updated_at">) {
    const hasher = new BcryptAdapter(12);
    const { id, ...rest } = model;
    try {
      return new Entity(hasher, { ...rest }, new UniqueEntityId(id));
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.error);
      }
      throw e;
    }
  }
}
