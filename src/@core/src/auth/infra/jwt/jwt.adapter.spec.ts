import { JWTError } from "#seedwork/domain";
import { JWTAdapter } from "./jwt.adapter";

describe("jwt adapter unit test", () => {
  it("should generate token", async () => {
    const jwt = new JWTAdapter("test");

    const spyGenerateToken = jest.spyOn(jwt, "generateToken");
    jwt.generateToken(
      {
        sub: "5d46e307-3c2b-4c94-8425-f00b13e2fbb5",
        name: "some name",
      },
      { expiresIn: "1h" }
    );
    expect(spyGenerateToken).toHaveBeenCalledTimes(1);
  });

  it("should validate token", async () => {
    const jwt = new JWTAdapter("test");
    const token = jwt.generateToken(
      {
        sub: "5d46e307-3c2b-4c94-8425-f00b13e2fbb5",
        name: "some name",
      },
      { expiresIn: "1h" }
    );
    expect(token).toBeDefined();

    const decoded = jwt.validateToken(token);

    expect(decoded).toMatchObject({
      sub: "5d46e307-3c2b-4c94-8425-f00b13e2fbb5",
      name: "some name",
    });
  });

  it("should throw if generate token throws", () => {
    const jwt = new JWTAdapter("test");

    //@ts-ignore
    jest.spyOn(jwt, "generateToken").mockRejectedValueOnce(() => {
      throw new JWTError("Invalid information");
    });

    expect(jwt.generateToken("")).rejects.toThrow(
      new JWTError("Invalid information")
    );
  });

  it("should throw if validate throw", () => {
    const jwt = new JWTAdapter("test");

    //@ts-ignore
    jest.spyOn(jwt, "validateToken").mockRejectedValueOnce(() => {
      throw new JWTError("jwt must be provided");
    });
    expect(jwt.validateToken("")).rejects.toThrow(
      new JWTError("jwt must be provided")
    );
  });
});
