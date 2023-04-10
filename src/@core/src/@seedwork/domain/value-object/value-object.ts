import { deepFreeze } from "../utils/object";

export abstract class ValueObject<Value = any> {
  protected readonly _value: Value;
  constructor(value: Value) {
    this._value = deepFreeze(value);
  }

  get value(): Value {
    return this._value;
  }

  toString = () => {
    if (typeof this.value !== "object" || this._value === null) {
      try {
        return this._value.toString();
      } catch (err) {
        return this.value + "";
      }
    }
    const valueString = this.value.toString();
    return valueString === "[object Object]"
      ? JSON.stringify(this.value)
      : valueString;
  };
}

export default ValueObject;
