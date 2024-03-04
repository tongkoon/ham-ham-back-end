import bodyParser from "body-parser";
import express from "express";
import { router as user } from "./api/user";

export const app = express();

// app.use(
//     cors({
//       origin: "*",
//     })
//   );
app.use(bodyParser.text());
app.use(bodyParser.json());
// app.use("/", index);
// app.use("/", user);
app.use('/user',user);
// app.use('/',picture);
// app.use("/", (req, res) => {
//     res.send("Hello World!!!");
//   });
