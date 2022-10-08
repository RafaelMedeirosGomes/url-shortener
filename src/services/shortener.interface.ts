import { UrlDTO } from "../handlers/url.handler";

export interface UrlAndExpireTime {
  longUrl: UrlDTO["longUrl"] | null;
  expiryTime: number;
}

export default interface IShortenerService {
  generateID: () => string;

  createNewEntity: (url: string) => Promise<UrlDTO>;

  getEntity: (uuid: string) => Promise<UrlDTO | null>;
}
