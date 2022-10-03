import express from "express";
import errorHandler from "./handlers/error.handler";

const app = express();

app.use(express.json());

app.get("/ping", (_req, res) => res.status(200).send("pong"));

app.use(errorHandler);

export default app;
