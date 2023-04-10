import ClassValidatorFields from "../class-validator";
import * as libClassValidator from "class-validator";

class StubValidatorFields extends ClassValidatorFields<{ field: string }> {}

describe("class validator unit test", () => {
  it("should initialize errors and validateData variables with null", () => {
    const validator = new StubValidatorFields();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with erros", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([
      { property: "field", constraints: { isRequired: "some error" } },
    ]);
    const validator = new StubValidatorFields();
    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({ field: ["some error"] });
  });

  it("Should validate without errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([]);
    const validator = new StubValidatorFields();
    expect(validator.validate({ field: "value" })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toStrictEqual({ field: "value" });
    expect(validator.errors).toBeNull();
  });
});
