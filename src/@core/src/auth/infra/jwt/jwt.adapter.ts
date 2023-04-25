import { JWTError } from "#seedwork/domain";
import { AuthenticationInterface } from "#seedwork/infra";
import * as jwt from "jsonwebtoken";

export class JWTAdapter implements AuthenticationInterface {
  constructor(private readonly secret: string) {
    this.secret = secret;
  }

  generateToken(payload: any, options?: any): string {
    try {
      return jwt.sign(payload, this.secret, options);
    } catch (e) {
      throw new JWTError(e.message);
    }
  }
  validateToken(token: string, options?: any) {
    try {
      return jwt.verify(token, this.secret, options);
    } catch (e) {
      throw new JWTError(e.message);
    }
  }
}
