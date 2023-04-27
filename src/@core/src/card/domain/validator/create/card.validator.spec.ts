import CardValidatorFactory, {
  CardRules,
  CardValidator,
} from "./card.validator";

describe("card validator unit test", () => {
  let validator: CardValidator;
  beforeEach(() => (validator = CardValidatorFactory.create()));

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

  it("invalid cases for number field", () => {
    expect({ validator, data: { number: null } }).containsErrorMessages({
      number: [
        "number should not be empty",
        "number must be a number conforming to the specified constraints",
      ],
    });
    expect({ validator, data: { number: "a" } }).containsErrorMessages({
      number: [
        "number must be a number conforming to the specified constraints",
      ],
    });
  });

  it("invalid cases for category field", () => {
    expect({ validator, data: { category: null } }).containsErrorMessages({
      category: ["category should not be empty", "category must be a string"],
    });
    expect({ validator, data: { category: "" } }).containsErrorMessages({
      category: ["category should not be empty"],
    });
    expect({ validator, data: { category: 5 } }).containsErrorMessages({
      category: ["category must be a string"],
    });
  });

  it("invalid cases for image_url field", () => {
    expect({ validator, data: { image_url: null } }).containsErrorMessages({
      image_url: [
        "image_url should not be empty",
        "image_url must be a string",
      ],
    });
    expect({ validator, data: { image_url: "" } }).containsErrorMessages({
      image_url: ["image_url should not be empty"],
    });
    expect({ validator, data: { image_url: 5 } }).containsErrorMessages({
      image_url: ["image_url must be a string"],
    });
  });

  it("invalid cases for description field", () => {
    expect({ validator, data: { description: null } }).containsErrorMessages({
      description: [
        "description should not be empty",
        "description must be a string",
      ],
    });
    expect({ validator, data: { description: "" } }).containsErrorMessages({
      description: ["description should not be empty"],
    });
    expect({ validator, data: { description: 5 } }).containsErrorMessages({
      description: ["description must be a string"],
    });
  });

  it("invalid cases for atk field", () => {
    expect({ validator, data: { atk: null } }).containsErrorMessages({
      atk: ["atk should not be empty", "atk must be a string"],
    });
    expect({ validator, data: { atk: "" } }).containsErrorMessages({
      atk: ["atk should not be empty"],
    });
    expect({ validator, data: { atk: 5 } }).containsErrorMessages({
      atk: ["atk must be a string"],
    });
  });

  it("invalid cases for def field", () => {
    expect({ validator, data: { def: null } }).containsErrorMessages({
      def: ["def should not be empty", "def must be a string"],
    });
    expect({ validator, data: { def: "" } }).containsErrorMessages({
      def: ["def should not be empty"],
    });
    expect({ validator, data: { def: 5 } }).containsErrorMessages({
      def: ["def must be a string"],
    });
  });

  it("invalid cases for effect field", () => {
    expect({ validator, data: { effect: null } }).containsErrorMessages({
      effect: ["effect should not be empty", "effect must be a string"],
    });
    expect({ validator, data: { effect: "" } }).containsErrorMessages({
      effect: ["effect should not be empty"],
    });
    expect({ validator, data: { effect: 5 } }).containsErrorMessages({
      effect: ["effect must be a string"],
    });
  });

  it("invalid cases for main_card field", () => {
    expect({ validator, data: { main_card: null } }).containsErrorMessages({
      main_card: [
        "main_card should not be empty",
        "main_card must be a boolean value",
      ],
    });
    expect({ validator, data: { main_card: 5 } }).containsErrorMessages({
      main_card: ["main_card must be a boolean value"],
    });
  });

  test("valid cases for fields", () => {
    const arrange = [
      {
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
      {
        name: "some name 2 ",
        number: 2,
        category: "monster 2",
        image_url: "some image 2",
        description: "some description 2",
        atk: "atk 2",
        def: "def 2",
        effect: "some effect 2",
        main_card: true,
      },
    ];
    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CardRules(item));
    });
  });
});
