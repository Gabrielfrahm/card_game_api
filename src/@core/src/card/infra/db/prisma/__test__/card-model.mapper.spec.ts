import { Card } from "#card/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { prismaClient } from "#seedwork/infra";
import { CardModelMapper } from "../card-model.mapper";

describe("User Model Mapper  unit test", () => {
  beforeEach(async () => {
    await prismaClient.card.deleteMany({ where: {} });
  });

  afterEach(async () => {
    await prismaClient.card.deleteMany({ where: {} });
  });

  it("should convert a user model to a user entity", async () => {
    const created_at = new Date();

    const card = {
      name: "some name 4",
      number: 4,
      category: "monster 4",
      image_url: "some image 4",
      description: "some description 4",
      atk: "atk 4",
      def: "def 4",
      effect: "some effect 4",
      main_card: true,
      created_at,
    };

    const model = await prismaClient.card.create({
      data: card,
      select: {
        id: true,
        name: true,
        number: true,
        description: true,
        category: true,
        atk: true,
        def: true,
        effect: true,
        image_url: true,
        main_card: true,
        created_at: true,
      },
    });

    const entity = CardModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new Card(card, new UniqueEntityId(entity.id)).toJSON()
    );
  });
});
