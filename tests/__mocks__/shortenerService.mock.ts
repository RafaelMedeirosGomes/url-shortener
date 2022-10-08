import { UrlDTO } from "../../src/handlers/url.handler";
import IShortenerService from "../../src/services/shortener.interface";
import { UUID } from "./idGenerator.mock";
import { LONG_URL } from "./urlModel.mock";

function createMockEntity(expiresAt: Date): UrlDTO {
  return {
    longUrl: LONG_URL,
    shortUrl: UUID,
    expiresAt,
  };
}

function factoryOfShortenerServiceMock(
  expiresAt: Date,
  notFound = false
): IShortenerService {
  return {
    generateID: jest.fn().mockImplementation(function (): string {
      return UUID;
    }),
    createNewEntity: jest
      .fn()
      .mockImplementation(async function (): Promise<UrlDTO> {
        return createMockEntity(expiresAt);
      }),
    getEntity: jest.fn().mockImplementation(async function () {
      if (notFound) return null;
      return createMockEntity(expiresAt);
    }),
  };
}

export default factoryOfShortenerServiceMock;
