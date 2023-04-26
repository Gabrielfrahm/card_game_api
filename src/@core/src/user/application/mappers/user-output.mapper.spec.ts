import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";

import UserOutputMapper from "./user-output.mapper";

describe("User output mapper unit test", () => {
  it("should convert a user in output", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);
    const entity = new User(hasher, {
      email: "some@email.com",
      name: "Some name",
      password: "some password",
      created_at: new Date(),
    });

    const spyToJson = jest.spyOn(entity, "toJSON");
    const output = UserOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      email: entity.email,
      email_confirmation: false,
      name: entity.name,
      password: entity.password,
      created_at: entity.created_at,
    });
  });
});
