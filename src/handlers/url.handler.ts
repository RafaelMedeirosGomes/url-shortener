import { RequestHandler } from "express";
import IShortenerService from "../services/shortener.interface";

export default class UrlHandler {
  constructor(private readonly shortenerService: IShortenerService) {}

  createUrl: RequestHandler = async (req, res, next) => {
    const { url: longUrl } = req.body;
    if (typeof longUrl !== "string") {
      return res.status(400).json({ message: "Expected url key to be string" });
    }
    try {
      const { shortUrl, expiresAt } =
        await this.shortenerService.createNewEntity(longUrl);
      res.status(201).json({ shortUrl, expiresAt });
    } catch (error) {
      next(error);
    }
  };
}

export interface UrlDTO {
  longUrl: string;
  shortUrl: string;
  expiresAt: Date;
}
