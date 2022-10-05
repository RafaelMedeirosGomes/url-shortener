import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import app from "../../src/app";
import UrlModel from "../../src/database/url.model.mongoose";

describe("API v1 tests", () => {
  const API_URL = "/api/v1";
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
      const response = await request(app).get(`${API_URL}/ping`);

      expect(response.status).toBe(200);
      expect(response.text).toBe("pong");
    });
  });

  describe("/create route", () => {
    const LONG_URL = "https://github.com/RafaelMedeirosGomes/url-shortener";
    describe("when a POST request is sent should", () => {
      it("create a resource", async () => {
        const response = await request(app).post(`${API_URL}/create`).send({
          url: LONG_URL,
        });

        expect(response.status).toBe(201);
        expect(response.body.shortUrl).toBeDefined();
        expect(response.body.expiresAt).toBeDefined();

        const uuid = response.body.shortUrl.split("/")[1];
        const document = await UrlModel.findOne({
          uuid,
        });

        expect(document).toBeDefined();
        expect(document?.longUrl).toBe(LONG_URL);
      });
    });
  });
});
