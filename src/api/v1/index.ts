import { Router } from "express";
import UrlHandler from "../../handlers/url.handler";

export default class API {
  private readonly _router: Router;
  private readonly urlHandler: UrlHandler;

  constructor(router: Router, urlHandler: UrlHandler) {
    this._router = router;
    this.urlHandler = urlHandler;
    this._router.post("/create", this.urlHandler.createUrl);
    this._router.get("/ping", (_req, res) => res.status(200).send("pong"));
  }

  public get router(): Router {
    return this._router;
  }
}
