import UrlDAO from "../../src/database/url.dao";
import IUrlModel from "../../src/repository/url.interface";
import { UUID } from "./idGenerator.mock";

const LONG_URL = "https://github.com/RafaelMedeirosGomes/url-shortener";

function createMockDocument(createdAt: Date): Required<UrlDAO> {
  return {
    uuid: UUID,
    longUrl: LONG_URL,
    createdAt,
    counter: 0,
  };
}
function factoryOfUrlModelMock(createdAt: Date, notFound = false): IUrlModel {
  const mockDocument = createMockDocument(createdAt);

  const urlModelMock: IUrlModel = {
    create: async function (): Promise<Required<UrlDAO>> {
      return mockDocument;
    },
    findByUUIDAndIncrementCounter:
      async function (): Promise<Required<UrlDAO> | null> {
        if (notFound) return null;
        return mockDocument;
      },
  };

  return urlModelMock;
}

export { LONG_URL, createMockDocument };
export default factoryOfUrlModelMock;
