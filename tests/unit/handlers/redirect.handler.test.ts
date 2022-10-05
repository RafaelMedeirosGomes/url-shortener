import { Request, Response, NextFunction } from "express";

import RedirectHandler from "../../../src/handlers/redirect.handler";
import { UrlDTO } from "../../../src/handlers/url.handler";
import IShortenerService from "../../../src/services/shortener.interface";

describe("error handler tests", () => {
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
  });

  describe("given a request with valid id in params", () => {
    beforeAll(() => {
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
        getLongUrl: jest.fn().mockImplementation(function (): string {
          return LONG_URL;
        }),
      };
      redirectHandler = new RedirectHandler(serviceMock);
    });

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

  describe("given a request with invalid id in params", () => {
    beforeAll(() => {
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
        getLongUrl: jest.fn().mockImplementation(function (): null {
          return null;
        }),
      };
      redirectHandler = new RedirectHandler(serviceMock);
    });

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
});
