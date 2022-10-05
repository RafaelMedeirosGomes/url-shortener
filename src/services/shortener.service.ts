import UrlModel from "../database/url.model.mongoose";
import { UrlDTO } from "../handlers/url.handler";
import IShortenerService from "./shortener.interface";

export default class ShortenerService implements IShortenerService {
  private readonly idGenerator: { randomUUID: () => string };

  constructor(idGenerator: { randomUUID: () => string }) {
    this.idGenerator = idGenerator;
  }

  public async getLongUrl(uuid: string): Promise<string | null> {
    const entity = await UrlModel.findOne({ uuid });
    return entity !== null ? entity.longUrl : entity;
  }

  public generateID(): string {
    const randomId = this.idGenerator.randomUUID();
    return randomId;
  }

  public async createNewEntity(url: string): Promise<UrlDTO> {
    const prefix = process.env.URL_PREFIX ?? "www.us.com/";
    const uuid = this.generateID();

    const {
      uuid: shortUrl,
      longUrl,
      createdAt,
    } = await UrlModel.create({
      uuid,
      longUrl: url,
    });
    return { shortUrl: `${prefix}${shortUrl}`, longUrl, expiresAt: createdAt };
  }
}
