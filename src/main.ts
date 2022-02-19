if (process.env.NODE_ENV === "local") {
  let config = require("dotenv").config;
  config();
}
import express from "express";
import helmet from "helmet";
import { appIndividual } from "./individual";
import { Database } from "./shared/database";
import { loggerRoot } from "./shared/logger";
import cors from "cors";
import path from "path";
import job from "./cron";

let uri: string = process.env.DB_URL ?? "";

const app = express();

const database = new Database();

database
  .connect()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    loggerRoot.error(err.message);
    process.exit(0);
  });

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use("/api/", appIndividual);
app.use(express.static(path.join(__dirname, "../../frontend-build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend-build", "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "404 path not found",
    data: {
      method: req.method,
      path: req.originalUrl,
    },
  });
});
// global error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (res.headersSent) return next(err);
  console.log(err);
  res.status(500).json({
    message: "500 server error",
    data: {
      method: req.method,
      path: req.originalUrl,
    },
  });
  console.error(err);
});

app.listen(process.env.PORT, () => {
  loggerRoot.info(`server is running on port: ${process.env.PORT}....`);
});

export { app, database };
