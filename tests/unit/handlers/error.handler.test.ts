import { Request, Response, NextFunction } from "express";
import errorHandler from "../../../src/handlers/error.handler";

describe("error handler tests", () => {
  let req: {};
  let res: { status: Function; json: Function };
  let next: Function;
  function callErrorHandler(error: Error): void {
    errorHandler(error, req as Request, res as Response, next as NextFunction);
  }
  beforeAll(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = (): void => {};
  });

  describe("given an error", () => {
    const error = new Error("Error message");

    it("when called should call res.status", () => {
      callErrorHandler(error);

      expect(res.status).toHaveBeenCalled();
    });
  });
});
