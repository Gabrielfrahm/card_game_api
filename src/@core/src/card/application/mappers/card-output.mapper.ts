import { Card } from "#card/domain";
import { CardOutput } from "../dtos";

export default class CardOutputMapper {
  static toOutput(entity: Card): CardOutput {
    return entity.toJSON();
  }
}
