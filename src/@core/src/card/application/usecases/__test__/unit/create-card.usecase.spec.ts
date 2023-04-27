import { CardInMemoryRepository } from "#card/infra";
import CreateCardUseCase from "../../create-card.usecase";

describe("create card use case unit test", () => {
  let repository: CardInMemoryRepository;
  let useCase: CreateCardUseCase.UseCase;

  beforeEach(() => {
    repository = new CardInMemoryRepository();
    useCase = new CreateCardUseCase.UseCase(repository);
  });

  it("should create a card", async () => {
    const spyRepository = jest.spyOn(repository, "insert");
    let output = await useCase.execute({
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

    output = await useCase.execute({
      name: "some name 2",
      number: 2,
      category: "monster 2",
      image_url: "some image 2",
      description: "some description 2",
      atk: "atk 2",
      def: "def 2",
      effect: "some effect 2",
      main_card: true,
      created_at: new Date(),
    });
    expect(spyRepository).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: repository.items[1].name,
      number: repository.items[1].number,
      category: repository.items[1].category,
      image_url: repository.items[1].image_url,
      description: repository.items[1].description,
      atk: repository.items[1].atk,
      def: repository.items[1].def,
      effect: repository.items[1].effect,
      main_card: repository.items[1].main_card,
      created_at: repository.items[1].created_at,
    });
  });
});
