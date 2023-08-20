import { it, expect, describe } from "vitest";
import supertest from "supertest";
import { app } from "../../src/app";

describe("Root route", () => {
  it("Should respond to GET method", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual("pong");
  });
});
