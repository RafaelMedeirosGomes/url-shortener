import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = function (err, _req, res, _next) {
  console.error(err.message);
  res.status(500).json({ message: "Server error. Check logs" });
};

export default errorHandler;
