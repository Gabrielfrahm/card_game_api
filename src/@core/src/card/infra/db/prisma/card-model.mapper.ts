import { Card } from "@prisma/client";
import { Card as Entity } from "#card/domain";
import {
  EntityValidationError,
  LoadEntityError,
  UniqueEntityId,
} from "#seedwork/domain";

export class CardModelMapper {
  static toEntity(model: Omit<Card, "updated_at">) {
    const { id, ...rest } = model;
    try {
      return new Entity({ ...rest }, new UniqueEntityId(id));
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.error);
      }
      throw e;
    }
  }
}
