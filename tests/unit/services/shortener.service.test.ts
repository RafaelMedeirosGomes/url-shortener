import ShortenerService, {
  Options,
} from "../../../src/services/shortener.service";
import factoryOfUrlModelMock, { LONG_URL } from "../../__mocks__/urlModel.mock";
import idGeneratorMock, { UUID } from "../../__mocks__/idGenerator.mock";

describe("shortener service tests", () => {
  const NOW = new Date(2022, 10, 5, 12, 0, 0);
  const EARLIER_TODAY = new Date(2022, 10, 5, 7, 0, 0);
  const FEW_DAYS_AGO = new Date(2022, 10, 2, 12, 0, 0);
  const CREATED_NOW_EXPIRES_AT = new Date(2022, 10, 6, 12, 0, 0);
  const options: Options = {
    expiryTimeInDays: 1,
    urlPrefix: "www.us.com/",
  };

  beforeAll(() => {
    jest.spyOn(Date, "now").mockReturnValue(NOW.valueOf());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("when generateID is called", () => {
    const modelMock = factoryOfUrlModelMock(EARLIER_TODAY);
    const shortenerService = new ShortenerService(
      modelMock,
      idGeneratorMock,
      options
    );

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
      const modelMock = factoryOfUrlModelMock(EARLIER_TODAY, true);
      const shortenerService = new ShortenerService(
        modelMock,
        idGeneratorMock,
        options
      );

      const entity = await shortenerService.getEntity(UUID);

      expect(entity).toBeNull();
    });

    it("if db finds old doc should return it", async () => {
      const modelMock = factoryOfUrlModelMock(FEW_DAYS_AGO, false);
      const shortenerService = new ShortenerService(
        modelMock,
        idGeneratorMock,
        options
      );

      const entity = await shortenerService.getEntity(UUID);

      expect(entity).not.toBeNull();
    });

    it("if db finds doc should return it", async () => {
      const modelMock = factoryOfUrlModelMock(NOW, false);
      const shortenerService = new ShortenerService(
        modelMock,
        idGeneratorMock,
        options
      );

      const entity = await shortenerService.getEntity(UUID);

      expect(entity).toEqual({
        shortUrl: options.urlPrefix.concat(UUID),
        longUrl: LONG_URL,
        expiresAt: CREATED_NOW_EXPIRES_AT,
      });
    });
  });

  describe("when createNewEntity is called", () => {
    it("should return expected object", async () => {
      const modelMock = factoryOfUrlModelMock(NOW, false);
      const shortenerService = new ShortenerService(
        modelMock,
        idGeneratorMock,
        options
      );

      const newEntity = await shortenerService.createNewEntity("");

      expect(newEntity).toStrictEqual({
        shortUrl: options.urlPrefix.concat(UUID),
        longUrl: LONG_URL,
        expiresAt: CREATED_NOW_EXPIRES_AT,
      });
    });
  });
});
