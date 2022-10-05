import { Request, Response, NextFunction } from "express";

import UrlHandler, { UrlDTO } from "../../../src/handlers/url.handler";
import IShortenerService from "../../../src/services/shortener.interface";

describe("error handler tests", () => {
  let urlHandler: UrlHandler;
  let req: {};
  let res: { status: Function; json: Function };
  let next: Function;
  let serviceMock: IShortenerService;
  const UUID = "12345678901";
  const LONG_URL = "https://github.com/RafaelMedeirosGomes/url-shortener";
  const EXPIRES_AT = new Date("10/04/2022");
  const TEST_ERROR = new Error("Error generated for testing purposes");
  beforeAll(() => {
    req = {
      body: { url: LONG_URL },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
    serviceMock = {
      generateID: jest.fn().mockImplementation(function (): string {
        return UUID;
      }),
      createNewEntity: jest
        .fn()
        .mockImplementationOnce(async function (): Promise<never> {
          throw TEST_ERROR;
        })
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
    urlHandler = new UrlHandler(serviceMock);
  });

  describe("given a request with url in body", () => {
    it("when service throws an error should call next", async () => {
      await urlHandler.createUrl(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(TEST_ERROR);
    });

    it("when called should call res with correct values", async () => {
      await urlHandler.createUrl(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(serviceMock.createNewEntity).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        shortUrl: UUID,
        expiresAt: EXPIRES_AT,
      });
    });
  });

  describe("given a request without body", () => {
    const emptyReq = { body: {} };
    it("when called should call res.status with error code", async () => {
      await urlHandler.createUrl(
        emptyReq as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
