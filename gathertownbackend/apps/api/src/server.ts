import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/index";

import dotenv from "dotenv"
dotenv.config()


export const createServer = (): Express => {
  const app = express();

  app.use(express.json())
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });

  app.use("/api/v1",router)
  return app;
};
