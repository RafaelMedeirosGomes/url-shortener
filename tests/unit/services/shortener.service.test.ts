import ShortenerService from "../../../src/services/shortener.service";
import UrlModel from "../../../src/database/url.model.mongoose";

describe("shortener service tests", () => {
  describe("when generateID is called", () => {
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
      const id = shortenerService.generateID();

      expect(typeof id).toBe("string");
    });

    it("with correct length", () => {
      const id = shortenerService.generateID();

      expect(id.length).toEqual(11);
    });
  });
});
