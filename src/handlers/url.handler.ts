import { RequestHandler } from "express";
import generateId from "../services/shortener.service";
import UrlModel from "../database/url.model.mongoose";

const createUrlHandler: RequestHandler = async function (req, res, _next) {
  const { url: longUrl } = req.body;
  if (typeof longUrl !== "string") {
    return res.status(400).json({ message: "Expected url key to be string" });
  }
  const shortUrl = generateId();
  try {
    const newDocument = await UrlModel.create({ shortUrl, longUrl });
    res.status(201).json({ shortUrl, expireAt: newDocument.createdAt });
  } catch (error) {
    console.error(req);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { createUrlHandler };
