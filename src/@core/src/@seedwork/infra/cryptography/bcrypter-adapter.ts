import { compareSync, hashSync } from "bcrypt";
import { HashCompare, Hasher } from "./cryptography.interface";

export namespace BcryptAdapter {
  export class HasherAdapter implements Hasher {
    private readonly salt: number;

    constructor(salt: number) {
      this.salt = salt;
    }

    async hash(value: string): Promise<string> {
      const hashed = hashSync(value, this.salt);
      return await Promise.resolve(hashed);
    }
  }

  export class CompareAdapter implements HashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return compareSync(value, hash);
    }
  }
}
