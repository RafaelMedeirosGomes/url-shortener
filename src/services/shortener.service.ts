import UrlDAO from "../database/url.dao";
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

  public async getEntity(uuid: string): Promise<UrlDTO | null> {
    const entity = await this.urlModel.findByUUID(uuid);
    if (entity === null) return null;
    const prefix = this.options.urlPrefix;
    const { longUrl } = entity;
    const expiresAt = this.expireAt(entity);
    return { shortUrl: `${prefix}${uuid}`, longUrl, expiresAt };
  }

  private expireAt(entity: Required<UrlDAO>): Date {
    const createdAt = entity.createdAt.valueOf();
    const expiryTime = this.daysToMilliseconds(this.options.expiryTimeInDays);
    return new Date(createdAt + expiryTime);
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
