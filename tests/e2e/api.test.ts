import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../../src/app";
import mongoose from "mongoose";
import UrlModel from "../../src/database/url.model.mongoose";

describe("API v1 tests", () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri(), { dbName: "testDB" });
  });

  afterAll(async () => {
    await mongod.stop();
    await mongoose.disconnect();
  });

  describe("/ping route", () => {
    it("when a GET request is sent should respond with pong", async () => {
      const response = await request(app).get("/ping");

      expect(response.status).toBe(200);
      expect(response.text).toBe("pong");
    });
  });

  describe("/create route", () => {
    const LONG_URL = "https://github.com/RafaelMedeirosGomes/url-shortener";
    describe("when a POST request is sent should", () => {
      it("create a resource", async () => {
        const response = await request(app).post("/create").send({
          url: LONG_URL,
        });

        expect(response.status).toBe(201);
        expect(response.body.shortUrl).toBeDefined();
        expect(response.body.expireAt).toBeDefined();

        const document = await UrlModel.findOne({
          shortUrl: response.body.shortUrl,
        });

        expect(document).toBeDefined();
        expect(document?.longUrl).toBe(LONG_URL);
      });
    });
  });
});
