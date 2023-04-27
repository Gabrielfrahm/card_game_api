import { Card } from "../card";

describe("Card Integration test", () => {
  describe("created method", () => {
    it("should a invalid card using name property", async () => {
      expect(
        () =>
          new Card({
            name: null,
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        name: ["name should not be empty", "name must be a string"],
      });

      expect(
        () =>
          new Card({
            name: "",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(
        () =>
          new Card({
            name: 5 as any,
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        name: ["name must be a string"],
      });
    });

    it("should a invalid card using number property", async () => {
      expect(
        () =>
          new Card({
            name: "some name",
            number: null,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        number: [
          "number should not be empty",
          "number must be a number conforming to the specified constraints",
        ],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: "a" as any,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        number: [
          "number must be a number conforming to the specified constraints",
        ],
      });
    });

    it("should a invalid card using category property", async () => {
      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: null,
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        category: ["category should not be empty", "category must be a string"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        category: ["category should not be empty"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: 1 as any,
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        category: ["category must be a string"],
      });
    });

    it("should a invalid card using image_url property", async () => {
      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: null,
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        image_url: [
          "image_url should not be empty",
          "image_url must be a string",
        ],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        image_url: ["image_url should not be empty"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: 1 as any,
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        image_url: ["image_url must be a string"],
      });
    });

    it("should a invalid card using description property", async () => {
      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: null,
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        description: [
          "description should not be empty",
          "description must be a string",
        ],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "",
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        description: ["description should not be empty"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: 1 as any,
            atk: "atk",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("should a invalid card using atk property", async () => {
      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: null,
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        atk: ["atk should not be empty", "atk must be a string"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "",
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        atk: ["atk should not be empty"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: 1 as any,
            def: "def",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        atk: ["atk must be a string"],
      });
    });

    it("should a invalid card using def property", async () => {
      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: null,
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        def: ["def should not be empty", "def must be a string"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "",
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        def: ["def should not be empty"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: 1 as any,
            effect: "some effect",
            main_card: false,
          })
      ).containsErrorMessages({
        def: ["def must be a string"],
      });
    });

    it("should a invalid card using effect property", async () => {
      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: null,
            main_card: false,
          })
      ).containsErrorMessages({
        effect: ["effect should not be empty", "effect must be a string"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "",
            main_card: false,
          })
      ).containsErrorMessages({
        effect: ["effect should not be empty"],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: 1 as any,
            main_card: false,
          })
      ).containsErrorMessages({
        effect: ["effect must be a string"],
      });
    });

    it("should a invalid card using main_card property", async () => {
      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "effect",
            main_card: null,
          })
      ).containsErrorMessages({
        main_card: [
          "main_card should not be empty",
          "main_card must be a boolean value",
        ],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "effect",
            main_card: "" as any,
          })
      ).containsErrorMessages({
        main_card: [
          "main_card should not be empty",
          "main_card must be a boolean value",
        ],
      });

      expect(
        () =>
          new Card({
            name: "some name",
            number: 1,
            category: "monster",
            image_url: "some image",
            description: "some description",
            atk: "atk",
            def: "def",
            effect: "effect",
            main_card: 1 as any,
          })
      ).containsErrorMessages({
        main_card: ["main_card must be a boolean value"],
      });
    });
  });
});
