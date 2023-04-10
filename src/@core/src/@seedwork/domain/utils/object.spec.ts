import { deepFreeze } from "./object";

describe("object unit test", () => {
  it("should not freeze a scalar value", () => {
    let arrange = [
      { received: "a", expected: "string" },
      { received: 1, expected: "number" },
      { received: true, expected: "boolean" },
      { received: false, expected: "boolean" },
    ];

    arrange.forEach((item) => {
      const str = deepFreeze(item.received);
      expect(typeof str).toBe(item.expected);
    });
  });

  it("should be a immutable object", () => {
    const obj = deepFreeze({
      prop1: "value 1",
      deep: { props2: "value 2", prop3: new Date() },
    });

    expect(() => {
      (obj as any).prop1 = "aaaaaaaa";
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );
  });
});
