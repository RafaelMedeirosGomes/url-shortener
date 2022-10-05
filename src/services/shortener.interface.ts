import { UrlDTO } from "../handlers/url.handler";

export default interface IShortenerService {
  generateID: () => string;

  createNewEntity: (url: string) => Promise<UrlDTO>;
}