import { validate as uuidValidate } from "uuid";
import { InvalidUuidError } from "#seedwork/domain/errors";
import { UniqueEntityId } from "../unique-entity-id.vo";

function spyValidateMethod() {
  return jest.spyOn(UniqueEntityId.prototype as any, "validate");
}
describe("unique entity id unit test", () => {
  it("should throw error when uuid is invalid", () => {
    const spyValidate = spyValidateMethod();
    expect(() => new UniqueEntityId("fake id")).toThrow(new InvalidUuidError());
    expect(spyValidate).toHaveBeenCalledTimes(1);
  });

  it("should accept a uuid passes in constructor", () => {
    const spyValidate = spyValidateMethod();
    const uuid = "68959edb-353e-41f5-b556-24acbd487571";
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(spyValidate).toHaveBeenCalledTimes(1);
  });

  it("should accept a uuid passed in constructor", () => {
    const validateSpy = spyValidateMethod();
    const vo = new UniqueEntityId();
    expect(uuidValidate(vo.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
