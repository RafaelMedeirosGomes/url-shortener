import express from "express";

import errorHandler from "./handlers/error.handler";
import router from "./api/v1";

const app = express();

app.use(express.json());

app.use("/api/v1", router);

app.use(errorHandler);

export default app;
