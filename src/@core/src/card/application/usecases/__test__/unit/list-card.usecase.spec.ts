import { Card, CardRepository } from "#card/domain";
import { CardInMemoryRepository } from "#card/infra";
import { UniqueEntityId } from "#seedwork/domain";
import ListCardUseCase from "../../list-card.usecase";

describe("list card  use case unit test", () => {
  let repository: CardInMemoryRepository;
  let useCase: ListCardUseCase.UseCase;

  beforeEach(() => {
    repository = new CardInMemoryRepository();
    useCase = new ListCardUseCase.UseCase(repository);
  });

  test("toOutput method", () => {
    let result = new CardRepository.CardSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      column: null,
    });
    let output = useCase["toOutPut"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

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
    result = new CardRepository.CardSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      column: null,
    });
    output = useCase["toOutPut"](result);
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  // it("should return output sorted by created_at when input param is empty", async () => {
  //   const items = [
  //     new Card(
  //       {
  //         name: "some name 1",
  //         number: 1,
  //         category: "monster 1",
  //         image_url: "some image 1",
  //         description: "some description 1",
  //         atk: "atk 1",
  //         def: "def 1",
  //         effect: "some effect 1",
  //         main_card: true,
  //         created_at: new Date(),
  //       },
  //       new UniqueEntityId("3abd8bab-8138-4c85-8cbb-4931c261e253")
  //     ),
  //     new Card(
  //       {
  //         name: "some name 2",
  //         number: 2,
  //         category: "monster 2",
  //         image_url: "some image 2",
  //         description: "some description 2",
  //         atk: "atk 2",
  //         def: "def 2",
  //         effect: "some effect 2",
  //         main_card: true,
  //         created_at: new Date(),
  //       },
  //       new UniqueEntityId("3abd8bab-8138-4c85-8cbb-4931c261e253")
  //     ),
  //   ];
  //   repository.items = items;

  //   const output = await useCase.execute({});

  //   expect(output).toMatchObject({
  //     items: [...items].reverse().map((i) => i.toJSON()),
  //     total: 2,
  //     current_page: 1,
  //     per_page: 10,
  //     last_page: 1,
  //   });
  // });

  it("should return output using pagination, sort and filter", async () => {
    const items = [
      new Card({
        name: "a",
        number: 1,
        category: "monster 1",
        image_url: "some image 1",
        description: "some description 1",
        atk: "atk 1",
        def: "def 1",
        effect: "some effect 1",
        main_card: true,
        created_at: new Date(),
      }),
      new Card({
        name: "AAA",
        number: 2,
        category: "monster 2",
        image_url: "some image 2",
        description: "some description 2",
        atk: "atk 2",
        def: "def 2",
        effect: "some effect 2",
        main_card: true,
        created_at: new Date(),
      }),
      new Card({
        name: "AaA",
        number: 3,
        category: "monster 3",
        image_url: "some image 3",
        description: "some description 3",
        atk: "atk 3",
        def: "def 3",
        effect: "some effect 3",
        main_card: true,
        created_at: new Date(),
      }),
      new Card({
        name: "b",
        number: 4,
        category: "monster 4",
        image_url: "some image 4",
        description: "some description 4",
        atk: "atk 4",
        def: "def 4",
        effect: "some effect 4",
        main_card: true,
        created_at: new Date(),
      }),
      new Card({
        name: "c",
        number: 5,
        category: "monster 5",
        image_url: "some image 5",
        description: "some description 5",
        atk: "atk 5",
        def: "def 5",
        effect: "some effect 5",
        main_card: true,
        created_at: new Date(),
      }),
    ];
    repository.items = items;
    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
      column: "name",
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
      column: "name",
    });

    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
      column: "name",
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
