import { Request, Response, NextFunction } from "express";

import RedirectHandler from "../../../src/handlers/redirect.handler";
import { UrlDTO } from "../../../src/handlers/url.handler";
import IShortenerService from "../../../src/services/shortener.interface";

describe("redirect handler tests", () => {
  let redirectHandler: RedirectHandler;
  let req: {};
  let res: { redirect: Function; status: Function; json: Function };
  let next: Function;
  let serviceMock: IShortenerService;
  const UUID = "12345678901";
  const LONG_URL = "https://github.com/RafaelMedeirosGomes/url-shortener";
  const EXPIRES_AT = new Date("10/04/2022");
  beforeAll(() => {
    req = {
      params: { uuid: UUID },
    };
    res = { redirect: jest.fn(), status: jest.fn(() => res), json: jest.fn() };
    next = (): void => {};
    serviceMock = {
      generateID: jest.fn().mockImplementation(function (): string {
        return UUID;
      }),
      createNewEntity: jest
        .fn()
        .mockImplementation(async function (): Promise<UrlDTO> {
          return {
            longUrl: LONG_URL,
            shortUrl: UUID,
            expiresAt: EXPIRES_AT,
          };
        }),
      getLongUrl: jest
        .fn()
        .mockImplementationOnce(function (): null {
          return null;
        })
        .mockImplementation(function (): string {
          return LONG_URL;
        }),
    };
    redirectHandler = new RedirectHandler(serviceMock);
  });

  describe("given a request with invalid id in params", () => {
    it("should return a Not Found code", async () => {
      await redirectHandler.redirect(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(serviceMock.getLongUrl).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("given a request with valid id in params", () => {
    it("when called should redirect", async () => {
      await redirectHandler.redirect(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(serviceMock.getLongUrl).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(301, LONG_URL);
    });
  });
});
