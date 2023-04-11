import { BcryptAdapter } from "../../../infra/index";
import { User } from "../user";

describe("User Integration test", () => {
  describe("created method", () => {
    it("should a invalid user using email property", async () => {
      const hasher = new BcryptAdapter(12);
      expect(
        () =>
          new User(hasher, {
            email: null,
            name: "user test",
            password: "12345",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        email: [
          "email must be an email",
          "email should not be empty",
          "email must be a string",
        ],
      });

      expect(
        () =>
          new User(hasher, {
            email: "",
            name: "user test",
            password: "12345",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        email: ["email must be an email", "email should not be empty"],
      });

      expect(
        () =>
          new User(hasher, {
            email: 5 as any,
            name: "user test",
            password: "12345",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        email: ["email must be an email", "email must be a string"],
      });
    });

    it("should a invalid user using email_confirmation property", async () => {
      const hasher = new BcryptAdapter(12);
      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            email_confirmation: "false" as any,
            name: "user test",
            password: "12345",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        email_confirmation: ["email_confirmation must be a boolean value"],
      });

      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            email_confirmation: 6 as any,
            name: "user test",
            password: "12345",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        email_confirmation: ["email_confirmation must be a boolean value"],
      });

      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            email_confirmation: "" as any,
            name: "user test",
            password: "12345",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        email_confirmation: [
          "email_confirmation must be a boolean value",
          "email_confirmation should not be empty",
        ],
      });
    });

    it("should a invalid user using password property", async () => {
      const hasher = new BcryptAdapter(12);
      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            name: "user test",
            password: 12345 as any,
            created_at: new Date(),
          })
      ).containsErrorMessages({
        password: ["password must be a string"],
      });

      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            name: "user test",
            password: "" as any,
            created_at: new Date(),
          })
      ).containsErrorMessages({
        password: ["password should not be empty"],
      });

      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            name: "user test",
            password: null as any,
            created_at: new Date(),
          })
      ).containsErrorMessages({
        password: ["password should not be empty", "password must be a string"],
      });
    });

    it("should a invalid user using name property", async () => {
      const hasher = new BcryptAdapter(12);
      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            name: "",
            password: "123456",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            name: null,
            password: "123456",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            name: 5 as any,
            password: "123456",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () =>
          new User(hasher, {
            email: "test@teste.com",
            name: "a".repeat(256),
            password: "123456",
            created_at: new Date(),
          })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should a valid user", async () => {
      const hasher = new BcryptAdapter(12);
      new User(hasher, {
        email: "test@teste.com",
        name: "some name",
        password: "123456",
        created_at: new Date(),
      });

      new User(hasher, {
        email: "test@teste.com",
        name: "some name",
        email_confirmation: true,
        password: "123456",
        created_at: new Date(),
      });

      new User(hasher, {
        email: "test@teste.com",
        name: "some name",
        email_confirmation: false,
        password: "123456",
        created_at: new Date(),
      });

      const user = new User(hasher, {
        email: "test@teste.com",
        name: "some name",
        email_confirmation: false,
        password: "123456",
        created_at: new Date(),
      });

      user.confirm();
      expect(user.email_confirmation).toBeTruthy();
      const spySetPassword = jest.spyOn(user, "setPassword");
      const spyHasher = jest.spyOn(hasher, "hash");
      await user.setPassword(user.password);
      expect(spySetPassword).toHaveBeenCalledTimes(1);
      expect(spyHasher).toHaveBeenCalledTimes(1);
    });
  });
});
