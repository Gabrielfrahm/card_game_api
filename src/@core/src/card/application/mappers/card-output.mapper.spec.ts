import { Card } from "#card/domain";
import CardOutputMapper from "./card-output.mapper";

describe("User output mapper unit test", () => {
  it("should convert a user in output", async () => {
    const entity = new Card({
      name: "fake",
      number: 1,
      category: "monster 1",
      image_url: "some image 1",
      description: "some description 1",
      atk: "atk 1",
      def: "def 1",
      effect: "some effect 1",
      main_card: false,
      created_at: new Date(),
    });

    const spyToJson = jest.spyOn(entity, "toJSON");
    const output = CardOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      number: entity.number,
      category: entity.category,
      image_url: entity.image_url,
      description: entity.description,
      atk: entity.atk,
      def: entity.def,
      effect: entity.effect,
      main_card: entity.main_card,
      created_at: entity.created_at,
    });
  });
});
