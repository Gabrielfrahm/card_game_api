import { Deck } from "#deck/domain";
import { DeckOutput } from "../dtos";

export default class DeckOutputMapper {
  static toOutput(entity: Omit<Deck, "updated_at">): DeckOutput {
    return entity.toJSON();
  }
}
