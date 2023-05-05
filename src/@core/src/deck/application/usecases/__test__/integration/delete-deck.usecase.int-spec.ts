import { CreateCardUseCase } from "#card/application";
import { CardPrismaRepository } from "#card/infra";
import { Deck } from "#deck/domain";
import { DeckPrismaRepository } from "#deck/infra";
import { UniqueEntityId } from "#seedwork/domain";
import { prismaClient } from "#seedwork/infra";

import { UserPrismaRepository } from "#user/infra";
import DeleteDeckUseCase from "../../delete-deck.usecase";

describe("update deck use case integration test", () => {
  let repository: DeckPrismaRepository;
  let cardRepository: CardPrismaRepository;
  let userRepository: UserPrismaRepository;
  let useCase: DeleteDeckUseCase.UseCase;
  let cardUseCase: CreateCardUseCase.UseCase;

  beforeEach(async () => {
    repository = new DeckPrismaRepository(prismaClient);
    cardRepository = new CardPrismaRepository(prismaClient);
    userRepository = new UserPrismaRepository(prismaClient);

    useCase = new DeleteDeckUseCase.UseCase(repository);
    cardUseCase = new CreateCardUseCase.UseCase(cardRepository);

    await prismaClient.deck.deleteMany({ where: {} });
    await prismaClient.deckCard.deleteMany({ where: {} });
    await prismaClient.card.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  afterAll(async () => {
    await prismaClient.deck.deleteMany({ where: {} });
    await prismaClient.deckCard.deleteMany({ where: {} });
    await prismaClient.card.deleteMany({ where: {} });
    await prismaClient.user.deleteMany({ where: {} });
  });

  it("should update a deck", async () => {
    const spyRepository = jest.spyOn(repository, "insert");
    let card = await cardUseCase.execute({
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

    const user = await prismaClient.user.create({
      data: {
        email: "email@email.com",
        name: "dale",
        password: "123",
        email_confirmation: false,
        created_at: new Date(),
      },
    });

    const userEntity = await userRepository.findById(user.id);

    await repository.insert(
      new Deck(
        {
          name: "deck 1",
          user: userEntity,
        },
        new UniqueEntityId("eb584c0a-dc9e-4901-bdd1-a881ac6a00b8")
      )
    );

    await useCase.execute({
      id: "eb584c0a-dc9e-4901-bdd1-a881ac6a00b8",
    });
    const decks = await prismaClient.deck.findMany();
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(decks).toHaveLength(0);
    // const entity = await repository.findById(output.id);
    // expect({
    //   id: output.id,
    //   name: output.name,
    //   user: output.user.id,
    //   created_at: output.created_at,
    // }).toMatchObject({
    //   id: entity.id,
    //   name: entity.name,
    //   user: entity.user.id,
    //   created_at: entity.created_at,
    // });
  });
});
