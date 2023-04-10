import ValueObject from "../value-object";

class StubValueObject extends ValueObject {}
describe("value object unit test", () => {
  it("should set value", () => {
    let vo = new StubValueObject("string value");
    expect(vo.value).toBe("string value");
    vo = new StubValueObject({ prop: "value" });
    expect(vo.value).toStrictEqual({ prop: "value" });
  });

  it("should convert to a string", () => {
    const date = new Date();
    let arrange = [
      { received: "", expected: "" },
      { received: "fake test", expected: "fake test" },
      { received: 0, expected: "0" },
      { received: 1, expected: "1" },
      { received: 5, expected: "5" },
      { received: true, expected: "true" },
      { received: false, expected: "false" },
      { received: date, expected: date.toString() },
      {
        received: { prop: "prop1" },
        expected: JSON.stringify({ prop: "prop1" }),
      },
    ];

    arrange.forEach((value) => {
      const vo = new StubValueObject(value.received);
      expect(vo + "").toBe(value.expected);
    });
  });

  it("should be a immutable object", () => {
    const obj = {
      prop1: "value 1",
      deep: { props2: "value 2", prop3: new Date() },
    };
    const vo = new StubValueObject(obj);
    expect(() => {
      (vo as any).value.prop1 = "test";
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );
  });
});
