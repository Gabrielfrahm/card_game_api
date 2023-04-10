import UserVAlidatorFactory, {
  UserRules,
  UserValidator,
} from "./user.validator";

describe("User validator test unit", () => {
  let validator: UserValidator;
  beforeEach(() => (validator = UserVAlidatorFactory.create()));
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

  test("invalidation cases for email_confirmation", () => {
    expect({
      validator,
      data: { email_confirmation: "" },
    }).containsErrorMessages({
      email_confirmation: [
        "email_confirmation must be a boolean value",
        "email_confirmation should not be empty",
      ],
    });

    expect({
      validator,
      data: { email_confirmation: 20 },
    }).containsErrorMessages({
      email_confirmation: ["email_confirmation must be a boolean value"],
    });
  });

  test("invalidation cases for password", () => {
    expect({
      validator,
      data: { password: "" },
    }).containsErrorMessages({
      password: ["password should not be empty"],
    });

    expect({
      validator,
      data: { password: true },
    }).containsErrorMessages({
      password: ["password must be a string"],
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
      expect(validator.validatedData).toStrictEqual(new UserRules(item));
    });
  });
});
