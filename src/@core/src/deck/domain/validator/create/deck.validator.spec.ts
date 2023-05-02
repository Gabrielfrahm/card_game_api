import { Card } from "#card/domain";
import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";
import DeckValidatorFactory, {
  DeckRules,
  DeckValidator,
} from "./deck.validator";

describe("deck validator unit test", () => {
  let validator: DeckValidator;
  beforeEach(() => (validator = DeckValidatorFactory.create()));

  it("invalid cases for name field", () => {
    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: ["name should not be empty", "name must be a string"],
    });
    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty"],
    });
    expect({ validator, data: { name: 5 } }).containsErrorMessages({
      name: ["name must be a string"],
    });
  });

  it("invalid cases for user field", () => {
    expect({ validator, data: { user: null } }).containsErrorMessages({
      user: ["user should not be empty"],
    });
    expect({ validator, data: { user: "" } }).containsErrorMessages({
      user: ["user should not be empty"],
    });
  });

  test("valid cases for fields", () => {
    const arrange = [
      {
        name: "some name",
        user: new User(new BcryptAdapter.HasherAdapter(12), {
          name: "some name",
          email: "email@email.com",
          password: "123",
        }),
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
        ],
        main_card: new Card({
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: true,
        }),
      },
      {
        name: "some name",
        user: new User(new BcryptAdapter.HasherAdapter(12), {
          name: "some name",
          email: "email@email.com",
          password: "123",
        }),
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
        ],
        main_card: new Card({
          name: "some name",
          number: 1,
          category: "monster",
          image_url: "some image",
          description: "some description",
          atk: "atk",
          def: "def",
          effect: "some effect",
          main_card: true,
        }),
      },
    ];
    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new DeckRules(item));
    });
  });
});
