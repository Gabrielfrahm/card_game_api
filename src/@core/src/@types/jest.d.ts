import { FieldsError } from "./@seedwork/domain/validators/validator-fields-interface";

declare global {
  declare namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsError) => R;
    }
  }
}

export {};
