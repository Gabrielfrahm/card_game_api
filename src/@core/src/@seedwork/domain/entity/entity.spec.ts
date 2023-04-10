import { validate as validateUUid } from "uuid";
import { UniqueEntityId } from "../value-object";
import Entity from "./entity";
class StubEntity extends Entity<{ prop1: string; prop2: number }> {}
describe("entity uni test", () => {
  it("should set props  and id", () => {
    const arrange = { prop1: "test prop", prop2: 10 };
    const entity = new StubEntity(arrange);
    expect(entity.props).toStrictEqual(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(validateUUid(entity.id)).toBeTruthy();
  });

  it("should accept a valid uuid", () => {
    const arrange = { prop1: "test prop", prop2: 10 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).toBe(uniqueEntityId.value);
  });

  it("should convert a entity to a Javascript Object", () => {
    const arrange = { prop1: "test prop", prop2: 10 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      ...arrange,
    });
  });
});
