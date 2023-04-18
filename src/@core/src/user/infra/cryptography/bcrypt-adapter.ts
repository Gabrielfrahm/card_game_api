import { Hasher } from "#seedwork/infra/cryptography";
import { hashSync } from "bcrypt";

export class BcryptAdapter implements Hasher {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<string> {
    const hashed = hashSync(value, this.salt);
    return await Promise.resolve(hashed);
  }
}

export default BcryptAdapter;
