import { RequestHandler } from "express";
import IShortenerService from "../services/shortener.interface";

export default class RedirectHandler {
  constructor(private readonly shortenerService: IShortenerService) {}

  redirect: RequestHandler = async (req, res, _next) => {
    const { uuid } = req.params;
    const maybeEntity = await this.shortenerService.getEntity(uuid);
    if (maybeEntity === null) {
      return res.status(404).json({ message: "URL Not found" });
    }
    if (Date.now() >= maybeEntity.expiresAt.valueOf()) {
      return res.status(410).json({ message: "URL expired" });
    }
    res.set("maxAge", maybeEntity.expiresAt.valueOf().toString());
    res.redirect(301, maybeEntity.longUrl);
  };
}
