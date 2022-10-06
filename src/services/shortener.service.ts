import UrlModel from "../database/url.model.mongoose";
import { UrlDTO } from "../handlers/url.handler";
import IShortenerService from "./shortener.interface";

export default class ShortenerService implements IShortenerService {
  private readonly idGenerator: { randomUUID: () => string };

  constructor(idGenerator: { randomUUID: () => string }) {
    this.idGenerator = idGenerator;
  }

  private daysToMilliseconds(days: number): number {
    return days * 24 * 60 * 60 * 1000;
  }

  public async getLongUrl(uuid: string): Promise<string | null> {
    const entity = await UrlModel.findOne({ uuid });
    if (entity === null) return null;
    const diffTime = Date.now() - entity.createdAt.valueOf();
    const expiryTimeInDays = process.env.URL_EXPIRY_TIME ?? "1";
    const expiryTime = this.daysToMilliseconds(parseInt(expiryTimeInDays, 10));
    if (diffTime > expiryTime) {
      return null;
    }
    return entity.longUrl;
  }

  public generateID(): string {
    const randomId = this.idGenerator.randomUUID();
    return randomId;
  }

  public async createNewEntity(url: string): Promise<UrlDTO> {
    const prefix = process.env.URL_PREFIX ?? "www.us.com/";
    const generatedId = this.generateID();

    const { uuid, longUrl, createdAt } = await UrlModel.create({
      uuid: generatedId,
      longUrl: url,
    });

    const expiryTimeInDays = process.env.URL_EXPIRY_TIME ?? "1";
    const expiryTime = this.daysToMilliseconds(parseInt(expiryTimeInDays, 10));
    const expiresAt = new Date(createdAt.valueOf() + expiryTime);

    return { shortUrl: `${prefix}${uuid}`, longUrl, expiresAt };
  }
}
