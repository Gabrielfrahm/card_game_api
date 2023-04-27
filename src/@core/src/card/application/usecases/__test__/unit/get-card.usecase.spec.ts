import { Card } from "#card/domain";
import { CardInMemoryRepository } from "#card/infra";
import { NotFoundError } from "#seedwork/domain";
import GetCardUseCase from "../../get-card.usecase";

describe("get card use case unit test", () => {
  let repository: CardInMemoryRepository;
  let useCase: GetCardUseCase.UseCase;

  beforeEach(() => {
    repository = new CardInMemoryRepository();
    useCase = new GetCardUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID fake id`)
    );
  });

  it("should get a card", async () => {
    const entity = new Card({
      name: "some name 1",
      number: 1,
      category: "monster 1",
      image_url: "some image 1",
      description: "some description 1",
      atk: "atk 1",
      def: "def 1",
      effect: "some effect 1",
      main_card: true,
      created_at: new Date(),
    });
    repository.items = [entity];
    const spyRepository = jest.spyOn(repository, "findById");
    let output = await useCase.execute({ id: entity.id });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: repository.items[0].name,
      number: repository.items[0].number,
      category: repository.items[0].category,
      image_url: repository.items[0].image_url,
      description: repository.items[0].description,
      atk: repository.items[0].atk,
      def: repository.items[0].def,
      effect: repository.items[0].effect,
      main_card: repository.items[0].main_card,
      created_at: repository.items[0].created_at,
    });
  });
});
