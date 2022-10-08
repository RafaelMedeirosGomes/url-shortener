import ShortenerService from "../../../src/services/shortener.service";
import FactoryOfUrlModelMock, { LONG_URL } from "../../__mocks__/urlModel.mock";
import idGeneratorMock, { UUID } from "../../__mocks__/idGenerator.mock";

describe("shortener service tests", () => {
  const DEFAULT_PREFIX = "www.us.com/";
  const NOW = new Date(2022, 10, 5, 12, 0, 0);
  const EARLIER_TODAY = new Date(2022, 10, 5, 7, 0, 0);
  const FEW_DAYS_AGO = new Date(2022, 10, 2, 12, 0, 0);
  const CREATED_NOW_EXPIRES_AT = new Date(2022, 10, 6, 12, 0, 0);

  beforeAll(() => {
    jest.spyOn(Date, "now").mockReturnValue(NOW.valueOf());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("when generateID is called", () => {
    const modelMock = FactoryOfUrlModelMock(EARLIER_TODAY);
    const shortenerService = new ShortenerService(modelMock, idGeneratorMock);

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
      const modelMock = FactoryOfUrlModelMock(EARLIER_TODAY, true);
      const shortenerService = new ShortenerService(modelMock, idGeneratorMock);

      const url = await shortenerService.getLongUrl(UUID);

      expect(url).toBeNull();
    });

    it("if db finds old doc should return null", async () => {
      const modelMock = FactoryOfUrlModelMock(FEW_DAYS_AGO, false);
      const shortenerService = new ShortenerService(modelMock, idGeneratorMock);

      const url = await shortenerService.getLongUrl(UUID);

      expect(url).toBeNull();
    });

    it("if db finds doc should return its url", async () => {
      const modelMock = FactoryOfUrlModelMock(EARLIER_TODAY, false);
      const shortenerService = new ShortenerService(modelMock, idGeneratorMock);

      const url = await shortenerService.getLongUrl(UUID);

      expect(typeof url).toBe("string");
    });
  });

  describe("when createNewEntity is called", () => {
    it("should return expected object", async () => {
      const modelMock = FactoryOfUrlModelMock(NOW, false);
      const shortenerService = new ShortenerService(modelMock, idGeneratorMock);

      const newEntity = await shortenerService.createNewEntity("");

      expect(newEntity).toStrictEqual({
        shortUrl: DEFAULT_PREFIX.concat(UUID),
        longUrl: LONG_URL,
        expiresAt: CREATED_NOW_EXPIRES_AT,
      });
    });
  });
});
