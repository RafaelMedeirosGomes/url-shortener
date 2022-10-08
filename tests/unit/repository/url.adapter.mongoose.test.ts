import UrlModel from "../../../src/repository/url.adapter.mongoose";
import UrlMongooseModel from "../../../src/database/url.model.mongoose";
import { UUID } from "../../__mocks__/idGenerator.mock";
import { createMockDocument } from "../../__mocks__/urlModel.mock";

describe("Url model Mongoose adapter tests", () => {
  let createSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;
  const documentMock = createMockDocument(new Date(2022, 10, 10));

  beforeAll(() => {
    createSpy = jest
      .spyOn(UrlMongooseModel, "create")
      .mockImplementation(async function () {
        return documentMock;
      });
    findOneSpy = jest
      .spyOn(UrlMongooseModel, "findOne")
      .mockResolvedValue(documentMock);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should call Mongoose.create when creating a document", async () => {
    const model = new UrlModel();

    await model.create(documentMock);

    expect(createSpy).toHaveBeenCalledWith(documentMock);
  });

  it("should call Mongoose.findOne when searching a document", async () => {
    const model = new UrlModel();

    await model.findByUUID(UUID);

    expect(findOneSpy).toHaveBeenCalledWith({ uuid: UUID });
  });
});
