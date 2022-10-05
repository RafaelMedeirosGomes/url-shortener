import UrlModel from "../database/url.model.mongoose";
import { UrlDTO } from "../handlers/url.handler";
import IShortenerService from "./shortener.interface";

export default class ShortenerService implements IShortenerService {
  private readonly idGenerator: { randomUUID: () => string };

  constructor(idGenerator: { randomUUID: () => string }) {
    this.idGenerator = idGenerator;
  }

  public generateShortUrl(prefix = "www.us.com/"): string {
    const randomId = this.idGenerator.randomUUID();
    return `${prefix}${randomId}`;
  }

  public async createNewEntity(url: string): Promise<UrlDTO> {
    const shortenedUrl = this.generateShortUrl();

    const { shortUrl, longUrl, createdAt } = await UrlModel.create({
      shortUrl: shortenedUrl,
      longUrl: url,
    });
    return { shortUrl, longUrl, expiresAt: createdAt };
  }
}
