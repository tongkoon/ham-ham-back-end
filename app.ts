import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { router as upload } from "./api/upload";
import { router as user } from "./api/user";

export const app = express();

app.use(
    cors({
      origin: "*",
    })
  );
app.use(bodyParser.text());
app.use(bodyParser.json());
// app.use("/", index);
// app.use("/", user);
app.use('/user',user);
app.use('/upload',upload);
// app.use("/", (req, res) => {
//     res.send("Hello World!!!");
//   });
