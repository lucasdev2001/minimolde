import * as dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
import { it, describe, expect } from "vitest";

const { PORT } = process.env;

describe("Env variables", () => {
  it("should define PORT", () => {
    expect(PORT).toBeDefined();
  });
});
