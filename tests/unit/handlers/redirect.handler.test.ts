import { Request, Response, NextFunction } from "express";

import RedirectHandler from "../../../src/handlers/redirect.handler";
import { UrlDTO } from "../../../src/handlers/url.handler";
import IShortenerService from "../../../src/services/shortener.interface";
import { UUID } from "../../__mocks__/idGenerator.mock";
import { LONG_URL } from "../../__mocks__/urlModel.mock";

describe("redirect handler tests", () => {
  const NOW = new Date(2022, 10, 5, 12, 0, 0);
  const VALID_EXPIRE_DATE = new Date(2022, 10, 5, 19, 0, 0);
  const INVALID_EXPIRE_DATE = new Date(2021, 10, 5, 12, 0, 0);

  let req: {};
  let res: {
    redirect: Function;
    status: Function;
    json: Function;
    set: Function;
  };
  let next: Function;
  let serviceMock: IShortenerService;
  beforeAll(() => {
    jest.spyOn(Date, "now").mockReturnValue(NOW.valueOf());
    req = {
      params: { uuid: UUID },
    };
    res = {
      redirect: jest.fn(),
      status: jest.fn(() => res),
      json: jest.fn(),
      set: jest.fn(),
    };
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
            expiresAt: VALID_EXPIRE_DATE,
          };
        }),
      getEntity: jest.fn(),
    };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("when it doesn't find resource", () => {
    let redirectHandler: RedirectHandler;
    beforeAll(() => {
      serviceMock = {
        ...serviceMock,
        getEntity: jest.fn().mockImplementation(function (): null {
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

      expect(serviceMock.getEntity).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("when it finds expired resource", () => {
    let redirectHandler: RedirectHandler;
    beforeAll(() => {
      serviceMock = {
        ...serviceMock,
        getEntity: jest
          .fn()
          .mockImplementation(async function (): Promise<UrlDTO> {
            return {
              longUrl: LONG_URL,
              shortUrl: UUID,
              expiresAt: INVALID_EXPIRE_DATE,
            };
          }),
      };
      redirectHandler = new RedirectHandler(serviceMock);
    });

    it("should return a Gone code", async () => {
      await redirectHandler.redirect(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(serviceMock.getEntity).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(410);
    });
  });

  describe("when it finds valid resource", () => {
    let redirectHandler: RedirectHandler;
    beforeAll(() => {
      serviceMock = {
        ...serviceMock,
        getEntity: jest
          .fn()
          .mockImplementation(async function (): Promise<UrlDTO> {
            return {
              longUrl: LONG_URL,
              shortUrl: UUID,
              expiresAt: VALID_EXPIRE_DATE,
            };
          }),
      };
      redirectHandler = new RedirectHandler(serviceMock);
    });

    it("should set header with expiration time", async () => {
      await redirectHandler.redirect(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(serviceMock.getEntity).toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith(
        "maxAge",
        VALID_EXPIRE_DATE.valueOf().toString()
      );
    });

    it("should redirect", async () => {
      await redirectHandler.redirect(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(serviceMock.getEntity).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(301, LONG_URL);
    });
  });
});
