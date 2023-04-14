import { EntityValidationError, UniqueEntityId } from "#seedwork/domain";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { User as Entity } from "#user/domain";
import { BcryptAdapter } from "#user/infra/cryptography";
import { User } from "@prisma/client";

export class UserModelMapper {
  static toEntity(model: User) {
    const hasher = new BcryptAdapter(12);
    try {
      return new Entity(hasher, { ...model });
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.error);
      }
      throw e;
    }
  }
}
