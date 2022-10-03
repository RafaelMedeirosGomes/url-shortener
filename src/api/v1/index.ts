import express from "express";

const router = express.Router();

router.get("/ping", (_req, res) => res.status(200).send("pong"));

export default router;
