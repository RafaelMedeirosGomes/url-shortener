import request from "supertest";
import app from "../../src/app";

describe("API v1 tests", () => {
  describe("/ping route", () => {
    it("when a GET request is sent should respond with pong", async () => {
      const response = await request(app).get("/ping");

      expect(response.status).toBe(200);
      expect(response.text).toBe("pong");
    });
  });
});
