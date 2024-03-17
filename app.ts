import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import 'intl';
import 'intl/locale-data/jsonp/en';
Intl.DateTimeFormat().resolvedOptions().timeZone = 'Asia/Bangkok';

import { router as t } from "./api/jwtToken";
import { router as picture } from "./api/picture/picture.router";
import { router as user } from "./api/user/user.router";
import { router as vote } from "./api/vote/vote.router";

export const app = express();

app.use(
    cors({
      origin: "*",
    })
  );
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use('/user',user)
app.use('/picture',picture);
app.use('/vote',vote);

app.use('/testToken',t)
// app.use('/user',user);
// app.use('/vote',vote);
