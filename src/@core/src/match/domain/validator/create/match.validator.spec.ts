import MatchValidatorFactory, {
  MatchRules,
  MatchValidator,
} from "./match.validator";

describe("Match Validator unit test", () => {
  let validator: MatchValidator;
  beforeEach(() => (validator = MatchValidatorFactory.create()));

  test("invalid cases for host_id", () => {
    expect({ validator, data: { host_id: null } }).containsErrorMessages({
      host_id: ["host_id should not be empty", "host_id must be a string"],
    });

    expect({ validator, data: { host_id: "" } }).containsErrorMessages({
      host_id: ["host_id should not be empty"],
    });

    expect({ validator, data: { host_id: 5 as any } }).containsErrorMessages({
      host_id: ["host_id must be a string"],
    });
  });

  test("valid cases", () => {
    const arrange = [
      {
        host_id: "asdasdsadasdasd",
      },
      {
        host_id: "asdasdsadasdasd",
        participation_id: "sadadsadas",
        status: "on",
      },
    ];
    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new MatchRules(item));
    });
  });
});
