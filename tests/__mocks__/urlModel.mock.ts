import UrlDAO from "../../src/database/url.dao";
import IUrlModel from "../../src/repository/url.interface";
import { UUID } from "./idGenerator.mock";

const LONG_URL = "https://github.com/RafaelMedeirosGomes/url-shortener";

function FactoryOfUrlModelMock(createdAt: Date, notFound = false): IUrlModel {
  const mockDocument: Required<UrlDAO> = {
    uuid: UUID,
    longUrl: LONG_URL,
    createdAt,
  };

  const urlModelMock: IUrlModel = {
    create: async function (): Promise<Required<UrlDAO>> {
      return mockDocument;
    },
    findByUUID: async function (): Promise<Required<UrlDAO> | null> {
      if (notFound) return null;
      return mockDocument;
    },
  };

  return urlModelMock;
}

export { LONG_URL };
export default FactoryOfUrlModelMock;
