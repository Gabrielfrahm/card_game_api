import { FieldsError } from "#seedwork/domain";

export class LoadEntityError extends Error {
  constructor(public error: FieldsError, message?: string) {
    super(message ?? "An entity not be loaded");
    this.name = "LoadEntityError";
  }
}
