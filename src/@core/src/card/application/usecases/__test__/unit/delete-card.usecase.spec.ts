import { Card } from "#card/domain";
import { CardInMemoryRepository } from "#card/infra";
import { NotFoundError } from "#seedwork/domain";
import DeleteCardUseCase from "../../delete-card.usecase";

describe("delete card use case unit test", () => {
  let repository: CardInMemoryRepository;
  let useCase: DeleteCardUseCase.UseCase;

  beforeEach(() => {
    repository = new CardInMemoryRepository();
    useCase = new DeleteCardUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID fake id`)
    );
  });

  it("should delete a user", async () => {
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
    const spyRepository = jest.spyOn(repository, "delete");
    await useCase.execute({ id: entity.id });
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(0);
  });
});
