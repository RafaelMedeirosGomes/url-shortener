import { Request, Response, NextFunction } from "express";

import UrlHandler, { UrlDTO } from "../../../src/handlers/url.handler";
import IShortenerService from "../../../src/services/shortener.interface";

describe("error handler tests", () => {
  let urlHandler: UrlHandler;
  let req: {};
  let res: { status: Function; json: Function };
  let next: Function;
  let serviceMock: IShortenerService;
  const SHORT_URL = "www.us.com/12345678901";
  const LONG_URL = "https://github.com/RafaelMedeirosGomes/url-shortener";
  const EXPIRES_AT = new Date("10/04/2022");
  beforeAll(() => {
    req = {
      body: { url: LONG_URL },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = (): void => {};
    serviceMock = {
      generateShortUrl: jest.fn().mockImplementation(function (): string {
        return "www.us.com/12345678901";
      }),
      createNewEntity: jest
        .fn()
        .mockImplementation(async function (): Promise<UrlDTO> {
          return {
            longUrl: LONG_URL,
            shortUrl: SHORT_URL,
            expiresAt: EXPIRES_AT,
          };
        }),
    };
    urlHandler = new UrlHandler(serviceMock);
  });

  describe("given a request with url in body", () => {
    it("when called should call res with correct values", async () => {
      await urlHandler.createUrl(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(serviceMock.createNewEntity).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        shortUrl: SHORT_URL,
        expiresAt: EXPIRES_AT,
      });
    });
  });

  describe("given a request without body", () => {
    const emptyReq = { body: {} };
    it("when called should call res.status with error code", () => {
      urlHandler.createUrl(
        emptyReq as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
