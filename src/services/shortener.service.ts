import { UrlDTO } from "../handlers/url.handler";
import IUrlModel from "../repository/url.interface";
import IShortenerService from "./shortener.interface";

export default class ShortenerService implements IShortenerService {
  constructor(
    private readonly urlModel: IUrlModel,
    private readonly idGenerator: { randomUUID: () => string }
  ) {}

  private daysToMilliseconds(days: number): number {
    return days * 24 * 60 * 60 * 1000;
  }

  public async getLongUrl(uuid: string): Promise<string | null> {
    const entity = await this.urlModel.findByUUID(uuid);
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

    const { uuid, longUrl, createdAt } = await this.urlModel.create({
      uuid: generatedId,
      longUrl: url,
    });

    const expiryTimeInDays = process.env.URL_EXPIRY_TIME ?? "1";
    const expiryTime = this.daysToMilliseconds(parseInt(expiryTimeInDays, 10));
    const expiresAt = new Date(createdAt.valueOf() + expiryTime);

    return { shortUrl: `${prefix}${uuid}`, longUrl, expiresAt };
  }
}
