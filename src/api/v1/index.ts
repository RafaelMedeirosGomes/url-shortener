import express from "express";
import urlHandler from "../../handlers/url.handler";

const router = express.Router();

router.post("/create", urlHandler.createUrlHandler);
router.get("/ping", (_req, res) => res.status(200).send("pong"));

export default router;
