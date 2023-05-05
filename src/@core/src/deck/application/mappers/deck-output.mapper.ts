import { Deck } from "#deck/domain";
import { DeckOutput } from "../dtos";

export default class DeckOutputMapper {
  static toOutput(entity: Deck): DeckOutput {
    return entity.toJSON();
  }
}
