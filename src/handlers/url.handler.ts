import { RequestHandler } from "express";
import { loadConfig } from "../utils/config";
import IShortenerService from "../services/shortener.interface";

export default class UrlHandler {
  constructor(private readonly shortenerService: IShortenerService) {}

  availableEndpoints(apiVersion: string): RequestHandler {
    const handler: RequestHandler = async (_req, res) => {
      const { URL_PREFIX } = loadConfig();
      const prefix = URL_PREFIX;
      res.status(200).json({
        links: [
          {
            href: `${prefix}${apiVersion}create`,
            type: "POST",
          },
        ],
      });
    };
    return handler;
  }

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
