import * as dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
import { it, describe, expect } from "vitest";

const { HTTP_PORT, BROKER_PORT, BROKER_OVER_WS_PORT, MONGO_URI } = process.env;

describe("Env variables", () => {
  it("should define HTTP_PORT", () => {
    expect(HTTP_PORT).toBeDefined();
  });

  it("should define BROKER_PORT", () => {
    expect(BROKER_PORT).toBeDefined();
  });

  it("should define BROKER_OVER_WS_PORT", () => {
    expect(BROKER_OVER_WS_PORT).toBeDefined();
  });

  it("should define MONGO_URI", () => {
    expect(MONGO_URI).toBeDefined();
  });
});
