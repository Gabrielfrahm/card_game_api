import {
  UserUpdateRules,
  UserUpdateValidator,
  UserUpdateValidatorFactory,
} from "./user-update.validator";

describe("User update validator test unit", () => {
  let validator: UserUpdateValidator;
  beforeEach(() => (validator = UserUpdateValidatorFactory.create()));
  test("invalidation cases for email", () => {
    expect({ validator, data: { email: null } }).containsErrorMessages({
      email: [
        "email must be an email",
        "email should not be empty",
        "email must be a string",
      ],
    });

    expect({ validator, data: { email: "" } }).containsErrorMessages({
      email: ["email must be an email", "email should not be empty"],
    });

    expect({ validator, data: { email: 5 as any } }).containsErrorMessages({
      email: ["email must be an email", "email must be a string"],
    });
  });

  test("invalidation cases for name field", () => {
    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty"],
    });

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({
      validator,
      data: { name: "t".repeat(256) },
    }).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    });
  });

  test("valid cases for fields", () => {
    const arrange = [
      {
        email: "teste@teste.com",
        email_confirmation: true,
        password: "123456",
        name: "some name",
        created_at: new Date(),
      },
      {
        email: "teste@teste.com",
        email_confirmation: false,
        password: "123456",
        name: "some name",
        created_at: new Date(),
      },
    ];
    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new UserUpdateRules(item));
    });
  });
});
