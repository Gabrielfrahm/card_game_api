import { Card } from "#card/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";
import { Deck } from "../deck";

describe("Deck Unit test", () => {
  beforeEach(() => {
    Deck.validate = jest.fn();
  });

  test("constructor of deck", () => {
    const user = new User(new BcryptAdapter.HasherAdapter(12), {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at: new Date(),
    });

    const props = {
      name: "deck 1",
      user: user,
      cards: [
        new Card({
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
        }),
        new Card({
          name: "some name",
          number: 2,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: true,
        }),
      ],
      main_card: new Card({
        name: "some name",
        number: 2,
        category: "monster",
        image_url: "some image",
        description: "some description",
        atk: "atk",
        def: "def",
        effect: "some effect",
        main_card: true,
      }),
    };
    const deck = new Deck(props);
    expect(Deck.validate).toHaveBeenCalled();

    expect(deck.props).toStrictEqual(props);
  });

  test("id field", () => {
    const user = new User(new BcryptAdapter.HasherAdapter(12), {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at: new Date(),
    });
    const data = [
      {
        props: {
          name: "deck 1",
          user: user,
          cards: [
            new Card({
              name: "some name",
              number: 1,
              category: "monster",
              image_url: "some image",
              description: "some description",
              atk: "atk",
              def: "def",
              effect: "some effect",
              main_card: false,
            }),
            new Card({
              name: "some name",
              number: 2,
              category: "monster",
              image_url: "some image",
              description: "some description",
              atk: "atk",
              def: "def",
              effect: "some effect",
              main_card: true,
            }),
          ],
          main_card: new Card({
            name: "some name",
            number: 2,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: true,
          }),
        },
      },
      {
        props: {
          name: "deck 1",
          user: user,
          cards: [
            new Card({
              name: "some name",
              number: 1,
              category: "monster",
              image_url: "some image",
              description: "some description",
              atk: "atk",
              def: "def",
              effect: "some effect",
              main_card: false,
            }),
            new Card({
              name: "some name",
              number: 2,
              category: "monster",
              image_url: "some image",
              description: "some description",
              atk: "atk",
              def: "def",
              effect: "some effect",
              main_card: true,
            }),
          ],
          main_card: new Card({
            name: "some name",
            number: 2,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: true,
          }),
        },
        id: null,
      },
      {
        props: {
          name: "deck 1",
          user: user,
          cards: [
            new Card({
              name: "some name",
              number: 1,
              category: "monster",
              image_url: "some image",
              description: "some description",
              atk: "atk",
              def: "def",
              effect: "some effect",
              main_card: false,
            }),
            new Card({
              name: "some name",
              number: 2,
              category: "monster",
              image_url: "some image",
              description: "some description",
              atk: "atk",
              def: "def",
              effect: "some effect",
              main_card: true,
            }),
          ],
          main_card: new Card({
            name: "some name",
            number: 2,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: true,
          }),
        },
        id: undefined,
      },
      {
        props: {
          name: "deck 1",
          user: user,
          cards: [
            new Card({
              name: "some name",
              number: 1,
              category: "monster",
              image_url: "some image",
              description: "some description",
              atk: "atk",
              def: "def",
              effect: "some effect",
              main_card: false,
            }),
            new Card({
              name: "some name",
              number: 2,
              category: "monster",
              image_url: "some image",
              description: "some description",
              atk: "atk",
              def: "def",
              effect: "some effect",
              main_card: true,
            }),
          ],
          main_card: new Card({
            name: "some name",
            number: 2,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: true,
          }),
        },
        id: new UniqueEntityId(),
      },
    ];
    data.forEach((i) => {
      const deck = new Deck(i.props, i.id);
      expect(deck.id).not.toBeNull();
      expect(deck.uniqueEntityId instanceof UniqueEntityId).toBeTruthy();
    });
  });

  test("getter fields", () => {
    const user = new User(new BcryptAdapter.HasherAdapter(12), {
      email: "test@test.com",
      email_confirmation: true,
      password: "12346",
      name: "some name",
      created_at: new Date(),
    });

    const props = {
      name: "deck 1",
      user: user,
      cards: [
        new Card({
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: false,
        }),
        new Card({
          name: "some name",
          number: 2,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: true,
        }),
      ],
      main_card: new Card({
        name: "some name",
        number: 2,
        category: "monster",
        image_url: "some image",
        description: "some description",
        atk: "atk",
        def: "def",
        effect: "some effect",
        main_card: true,
      }),
    };
    const deck = new Deck(props);

    expect(deck.name).toBe("deck 1");
    expect(deck.user).toBe(user);
    expect(deck.cards).toBe(props.cards);
    expect(deck.main_card).toBe(props.main_card);
  });
});
