import { BcryptAdapter } from "#seedwork/infra";
import { User } from "#user/domain";
import { Deck } from "../deck";

describe("Card Integration test", () => {
  describe("created method", () => {
    it("should a invalid deck using name property", async () => {
      const user = new User(new BcryptAdapter.HasherAdapter(12), {
        email: "dal@dale.com",
        name: "test",
        password: "123456",
      });

      expect(
        () =>
          new Deck({
            name: null,
            user,
          })
      ).containsErrorMessages({
        name: ["name should not be empty", "name must be a string"],
      });

      expect(
        () =>
          new Deck({
            name: "",
            user,
          })
      ).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(
        () =>
          new Deck({
            name: 5 as any,
            user,
          })
      ).containsErrorMessages({
        name: ["name must be a string"],
      });
    });
  });
});
