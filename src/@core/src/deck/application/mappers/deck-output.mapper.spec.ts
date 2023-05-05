import { Card } from "#card/domain";
import { Deck } from "#deck/domain";
import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";
import DeckOutputMapper from "./deck-output.mapper";

describe("User output mapper unit test", () => {
  it("should convert a user in output", async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);
    const user = new User(hasher, {
      email: "some@email.com",
      name: "Some name",
      password: "some password",
      created_at: new Date(),
    });

    const card = new Card({
      name: "some name 4",
      number: 4,
      category: "monster 4",
      image_url: "some image 4",
      description: "some description 4",
      atk: "atk 4",
      def: "def 4",
      effect: "some effect 4",
      main_card: true,
    });

    const deck = new Deck({
      name: "dale",
      user,
      cards: [card],
      main_card: card,
      created_at: new Date(),
    });

    const spyToJson = jest.spyOn(deck, "toJSON");
    const output = DeckOutputMapper.toOutput(deck);

    expect(spyToJson).toHaveBeenCalledTimes(1);

    expect(output).toStrictEqual({
      id: deck.id,
      name: deck.name,
      user: deck.user,
      cards: deck.cards,
      main_card: deck.main_card,
      created_at: deck.created_at,
    });
  });
});
