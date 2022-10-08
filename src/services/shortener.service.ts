import { UrlDTO } from "../handlers/url.handler";
import IUrlModel from "../repository/url.interface";
import IShortenerService from "./shortener.interface";

export interface Options {
  expiryTimeInDays: number;
  urlPrefix: string;
}

export default class ShortenerService implements IShortenerService {
  constructor(
    private readonly urlModel: IUrlModel,
    private readonly idGenerator: { randomUUID: () => string },
    private readonly options: Options
  ) {}

  private daysToMilliseconds(days: number): number {
    return days * 24 * 60 * 60 * 1000;
  }

  public async getLongUrl(uuid: string): Promise<string | null> {
    const entity = await this.urlModel.findByUUID(uuid);
    if (entity === null) return null;
    const diffTime = Date.now() - entity.createdAt.valueOf();
    const expiryTime = this.daysToMilliseconds(this.options.expiryTimeInDays);
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
    const prefix = this.options.urlPrefix;
    const generatedId = this.generateID();

    const { uuid, longUrl, createdAt } = await this.urlModel.create({
      uuid: generatedId,
      longUrl: url,
    });

    const expiryTime = this.daysToMilliseconds(this.options.expiryTimeInDays);
    const expiresAt = new Date(createdAt.valueOf() + expiryTime);

    return { shortUrl: `${prefix}${uuid}`, longUrl, expiresAt };
  }
}
