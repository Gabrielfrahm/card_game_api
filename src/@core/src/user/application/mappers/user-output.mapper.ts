import { User } from "#user/domain";
import { UserOutput } from "../dtos";

export default class UserOutputMapper {
  static toOutput(entity: User): UserOutput {
    return entity.toJSON();
  }
}
