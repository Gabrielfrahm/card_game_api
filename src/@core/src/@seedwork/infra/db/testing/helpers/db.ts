import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";

export namespace SetupPrisma {
  export const prismaMock = mockDeep<PrismaClient>();
  jest.mock("./prismaClient", () => ({
    prisma: prismaMock,
  }));

  beforeEach(() => {
    mockReset(prismaMock);
  });

  export const prisma = prismaMock;
}
