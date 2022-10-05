import ShortenerService from "../../../src/services/shortener.service";
import UrlModel from "../../../src/database/url.model.mongoose";

describe("shortener service tests", () => {
  describe("when generateUrl is called", () => {
    const DEFAULT_PREFIX = "www.us.com/";
    const idGeneratorMock = { randomUUID: () => "12345678901" };

    const shortenerService = new ShortenerService(idGeneratorMock);

    beforeAll(() => {
      jest.spyOn(UrlModel, "create").mockImplementation(async () => {
        return {
          shortUrl: "",
          longUrl: "",
          createdAt: Date.now(),
        };
      });
    });

    it("should create a string", () => {
      const id = shortenerService.generateShortUrl(DEFAULT_PREFIX);

      expect(typeof id).toBe("string");
    });

    it("with correct length", () => {
      const id = shortenerService.generateShortUrl(DEFAULT_PREFIX);

      expect(id.length).toBeLessThanOrEqual(22);
    });

    it("with default prefix", () => {
      const id = shortenerService.generateShortUrl(DEFAULT_PREFIX);

      expect(id.startsWith(DEFAULT_PREFIX)).toBe(true);
    });

    it("or with given prefix", () => {
      const givenPrefix = "www.br.com/";

      const id = shortenerService.generateShortUrl(givenPrefix);

      expect(id.startsWith(givenPrefix)).toBe(true);
    });
  });
});
