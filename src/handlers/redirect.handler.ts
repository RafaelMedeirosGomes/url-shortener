import { RequestHandler } from "express";
import IShortenerService from "../services/shortener.interface";

export default class RedirectHandler {
  constructor(private readonly shortenerService: IShortenerService) {}

  redirect: RequestHandler = async (req, res, _next) => {
    const { uuid } = req.params;
    const maybeUrl = await this.shortenerService.getLongUrl(uuid);
    if (maybeUrl === null)
      return res.status(404).json({ message: "Not found" });
    res.redirect(301, maybeUrl);
  };
}
