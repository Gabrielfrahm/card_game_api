import BcryptAdapter from "./bcrypt-adapter";

describe("bcrypt adapter unit test", () => {
  it("Should call bcrypt with correct values", async () => {
    const hasher = new BcryptAdapter(12);
    const spyHash = jest.spyOn(hasher, "hash");
    await hasher.hash("any_value");
    expect(spyHash).toHaveBeenCalledWith("any_value");
  });

  it("Should return a hash on success", async () => {
    const hasher = new BcryptAdapter(12);
    const hash = await hasher.hash("any_value");
    expect(hash).not.toBe("any_value");
  });

  it("Should throw if bcrypt throws", async () => {
    const hasher = new BcryptAdapter(12);
    jest.spyOn(hasher, "hash").mockRejectedValueOnce(() => {
      throw new Error();
    });
    const promise = hasher.hash("any_value");
    await expect(promise).rejects.toThrow();
  });

  it("Should throw if value is null or empty", async () => {
    const hasher = new BcryptAdapter(12);
    jest.spyOn(hasher, "hash").mockRejectedValueOnce(() => {
      throw new Error();
    });
    let promise = hasher.hash("");
    await expect(promise).rejects.toThrow();

    promise = hasher.hash(null);
    await expect(promise).rejects.toThrow();
  });
});
