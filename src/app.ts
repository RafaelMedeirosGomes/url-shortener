import express from "express";
import ShortUniqueId from "short-unique-id";

import errorHandler from "./handlers/error.handler";
import APIRouter from "./api/v1";
import UrlHandler from "./handlers/url.handler";
import ShortenerService from "./services/shortener.service";
import RedirectHandler from "./handlers/redirect.handler";

const app = express();
const uniqueIdService = new ShortUniqueId({ length: 11 });
const shortenerService = new ShortenerService(uniqueIdService);
const urlHandler = new UrlHandler(shortenerService);
const redirectHandler = new RedirectHandler(shortenerService);
const apiRouter = new APIRouter(express.Router(), urlHandler);
app.use(express.json());
app.use("/api/v1", apiRouter.router);
app.get("/:uuid", redirectHandler.redirect);
app.use(errorHandler);

export default app;
