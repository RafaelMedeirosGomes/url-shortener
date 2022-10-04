import { RequestHandler } from "express";
import ShortenerService from "../services/shortener.service";

const createUrlHandler: RequestHandler = async function (req, res, next) {
  const { url: longUrl } = req.body;
  if (typeof longUrl !== "string") {
    return res.status(400).json({ message: "Expected url key to be string" });
  }
  try {
    const { shortUrl, expiresAt } = await ShortenerService.createShortUrl(
      longUrl
    );
    res.status(201).json({ shortUrl, expiresAt });
  } catch (error) {
    next(error);
  }
};

export interface UrlDTO {
  longUrl: string;
  shortUrl: string;
  expiresAt: Date;
}

export default { createUrlHandler };
