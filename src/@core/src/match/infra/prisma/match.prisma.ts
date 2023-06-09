import { Match, MatchRepository } from "#match/domain";
import {
  AlreadyExisting,
  NotFoundError,
  UniqueEntityId,
} from "#seedwork/domain";
import { PrismaClient } from "@prisma/client";
import { MatchModelMapper } from "./match-model.mapper";

export class MatchPrismaRepository implements MatchRepository.Repository {
  sortableFields: string[] = ["created_at"];

  constructor(private matchModel: PrismaClient) {}

  search(
    props: MatchRepository.SearchParams,
    id?: string
  ): Promise<MatchRepository.MatchSearchResult> {
    throw new Error("Method not implemented.");
  }

  async insert(entity: Match): Promise<void> {
    const match = await this._getMatch(entity.host_id);
    if (match) {
      throw new AlreadyExisting(
        `Already have math with status awaiting_players`
      );
    }

    await this.matchModel.match.create({
      data: {
        id: entity.id,
        host_id: entity.host_id,
        participant_id: entity.participant_id,
        status: entity.status,
        created_at: entity.created_at,
      },
      select: {
        id: true,
        host_id: true,
        user: true,
        participant_id: true,
        participant: true,
        status: true,
        created_at: true,
      },
    });
  }

  async findById(id: string | UniqueEntityId): Promise<Match> {
    const _id = `${id}`;
    const model = await this._get(_id);
    if (model) {
      return MatchModelMapper.toEntity(model);
    }
  }

  findAll(id?: string): Promise<Match[]> {
    throw new Error("Method not implemented.");
  }

  update(entity: Match): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(id: string | UniqueEntityId): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async _get(id: string) {
    const match = await this.matchModel.match.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        host_id: true,
        user: true,
        participant_id: true,
        participant: true,
        status: true,
        created_at: true,
      },
    });

    if (!match) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return match;
  }

  private async _getMatch(host_id: string) {
    const match = await this.matchModel.match.findFirst({
      where: {
        AND: [
          {
            host_id: host_id,
          },
          {
            status: "awaiting_players",
          },
        ],
      },
      select: {
        id: true,
        host_id: true,
        user: true,
        participant_id: true,
        participant: true,
        status: true,
        created_at: true,
      },
    });

    return match;
  }
}
