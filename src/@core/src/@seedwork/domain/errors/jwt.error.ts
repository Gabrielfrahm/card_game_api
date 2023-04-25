export class JWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JWTError";
  }
}

export default JWTError;
