import { UrlDTO } from "../handlers/url.handler";

export default interface IShortenerService {
  generateShortUrl: (prefix?: string) => string;

  createNewEntity: (url: string) => Promise<UrlDTO>;
}
