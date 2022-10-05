import ShortenerService from "../../../src/services/shortener.service";
import UrlModel, { UrlDAO } from "../../../src/database/url.model.mongoose";
import { Query } from "mongoose";

interface mockDocument {
  uuid: string;
  longUrl: string;
  createdAt: Date;
}

describe("shortener service tests", () => {
  const DEFAULT_PREFIX = "www.us.com/";
  const idGeneratorMock = { randomUUID: () => "12345678901" };
  const CREATED_RECENTLY = new Date(2022, 10, 5);
  const CREATED_LONG_TIME_AGO = new Date(2021, 10, 5);
  const EXPIRES_AT = new Date(2022, 10, 6);
  const shortenerService = new ShortenerService(idGeneratorMock);
  const mockDocument: (createdAt?: Date) => mockDocument = (
    createdAt = CREATED_RECENTLY
  ) => ({
    uuid: "12345678901",
    longUrl: "https://github.com/RafaelMedeirosGomes/url-shortener",
    createdAt,
  });
  beforeAll(() => {
    function mockQuery(createdAt?: Date): Query<unknown, unknown, {}, UrlDAO> {
      return mockDocument(createdAt) as unknown as Query<
        unknown,
        unknown,
        {},
        UrlDAO
      >;
    }
    jest.spyOn(UrlModel, "create").mockImplementation(async () => {
      return mockDocument();
    });

    jest
      .spyOn(UrlModel, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockQuery(CREATED_LONG_TIME_AGO))
      .mockResolvedValue(mockQuery());
  });

  describe("when generateID is called", () => {
    it("should create a string", () => {
      const id = shortenerService.generateID();

      expect(typeof id).toBe("string");
    });

    it("with correct length", () => {
      const id = shortenerService.generateID();

      expect(id.length).toEqual(11);
    });
  });

  describe("when getLongUrl is called", () => {
    it("if db doesn't find doc should return null", async () => {
      const url = await shortenerService.getLongUrl(mockDocument().uuid);

      expect(url).toBeNull();
    });

    it("if db finds old doc should return null", async () => {
      const url = await shortenerService.getLongUrl(mockDocument().uuid);

      expect(url).toBeNull();
    });

    it("if db finds doc should return its url", async () => {
      const url = await shortenerService.getLongUrl(mockDocument().uuid);

      expect(url).toBe(mockDocument().longUrl);
    });
  });

  describe("when createNewEntity is called", () => {
    it("should return expected object", async () => {
      const newEntity = await shortenerService.createNewEntity("");
      expect(newEntity).toStrictEqual({
        shortUrl: DEFAULT_PREFIX.concat(mockDocument().uuid),
        longUrl: mockDocument().longUrl,
        expiresAt: EXPIRES_AT,
      });
    });
  });
});
