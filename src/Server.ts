import express from "express";
import Httpserver from "http";

import uploadAPIController from "./routes/Upload";
import getUploadedData from "./routes/GetUploadedData";

import cors from "cors";

export default class Server {
  private static app = express();
  private static httpServer = Httpserver.createServer(this.app);

  private static PORT = 8000;

  public static start() {
    // CORS config
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"],
      })
    );

    // API to handle form data upload
    this.app.use("/upload", uploadAPIController);

    // API to handle uploaded dara query
    this.app.use("/get-data", getUploadedData);

    // Start listening on port
    this.httpServer.listen(this.PORT, () =>
      console.log(`HTTP Server running on port ${this.PORT}`)
    );
  }
}
