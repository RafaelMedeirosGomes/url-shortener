import ShortUniqueId from "short-unique-id";
import UrlModel from "../database/url.model.mongoose";
import { UrlDTO } from "../handlers/url.handler";

const suid = new ShortUniqueId({ length: 11 });

function generateUrl(prefix = "www.us.com/"): string {
  return `${prefix}${suid.randomUUID()}`;
}

async function createShortUrl(url: string): Promise<UrlDTO> {
  const shortenedUrl = generateUrl();

  const { shortUrl, longUrl, createdAt } = await UrlModel.create({
    shortUrl: shortenedUrl,
    longUrl: url,
  });
  return { shortUrl, longUrl, expiresAt: createdAt };
}
export default { generateUrl, createShortUrl };
