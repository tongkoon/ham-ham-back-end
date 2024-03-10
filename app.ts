import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { router as picture } from "./api/picture";
import { router as user } from "./api/user";
import { router as vote } from "./api/vote";

export const app = express();

app.use(
    cors({
      origin: "*",
    })
  );
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use('/user',user);
app.use('/picture',picture);
app.use('/vote',vote);
