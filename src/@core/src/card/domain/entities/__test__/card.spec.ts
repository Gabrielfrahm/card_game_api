import { UniqueEntityId } from "#seedwork/domain";
import { Card } from "../card";

describe("Card Unit test", () => {
  beforeEach(() => {
    Card.validate = jest.fn();
  });

  test("constructor of card", () => {
    const props = {
      name: "some name",
      number: 1,
      category: "monster",
      image_url: "some image",
      description: "some description",
      atk: "atk",
      def: "def",
      effect: "some effect",
      main_card: false,
    };

    const card = new Card(props);
    expect(Card.validate).toHaveBeenCalled();

    expect(card.props).toStrictEqual(props);
  });

  test("id field", () => {
    const data = [
      {
        props: {
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
        },
      },
      {
        props: {
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
        },
        id: null,
      },
      {
        props: {
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
        },
        id: undefined,
      },
      {
        props: {
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
        },
        id: new UniqueEntityId(),
      },
    ];
    data.forEach((i) => {
      const card = new Card(i.props, i.id);
      expect(card.id).not.toBeNull();
      expect(card.uniqueEntityId instanceof UniqueEntityId).toBeTruthy();
    });
  });

  test("getter fields", () => {
    const card = new Card({
      name: "some name",
      number: 1,
      category: "monster",
      image_url: "some image",
      description: "some description",
      atk: "atk",
      def: "def",
      effect: "some effect",
      main_card: false,
    });

    expect(card.name).toBe("some name");
    expect(card.number).toBe(1);
    expect(card.category).toBe("monster");
    expect(card.image_url).toBe("some image");
    expect(card.description).toBe("some description");
    expect(card.atk).toBe("atk");
    expect(card.def).toBe("def");
    expect(card.effect).toBe("some effect");
    expect(card.main_card).toBeFalsy();
  });
});
