import { EntityValidationError, UniqueEntityId } from "#seedwork/domain";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { Match as Entity } from "#match/domain";
import { Match } from "@prisma/client";

export class MatchModelMapper {
  static toEntity(model: Omit<Match, "updated_at">) {
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
