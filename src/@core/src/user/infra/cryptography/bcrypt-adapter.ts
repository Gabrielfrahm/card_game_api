import { Hasher } from "#seedwork/infra";
import bcrypt from "bcrypt";

export class BcryptAdapter implements Hasher {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, this.salt);
    return await Promise.resolve(hashed);
  }
}

export default BcryptAdapter;
