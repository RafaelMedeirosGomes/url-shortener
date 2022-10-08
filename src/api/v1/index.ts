import { RequestHandler, Router } from "express";
import UrlHandler from "../../handlers/url.handler";
import { loadConfig } from "../../utils/config";

export default class API {
  private readonly API_VER = "api/v1/";

  constructor(
    private readonly _router: Router,
    private readonly urlHandler: UrlHandler
  ) {
    this._router.post("/create", this.urlHandler.createUrl);
    this._router.get("/", this.availableEndpoints);
  }

  public get router(): Router {
    return this._router;
  }

  private readonly availableEndpoints: RequestHandler = async (_req, res) => {
    const { URL_PREFIX } = loadConfig();
    res.status(200).json({
      links: [
        {
          href: `${URL_PREFIX}${this.API_VER}create`,
          type: "POST",
        },
      ],
    });
  };
}
