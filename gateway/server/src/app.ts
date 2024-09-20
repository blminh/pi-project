import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import fs from "fs/promises";
import { createServer } from "http";
import _ from "lodash";
import path from "path";
import { Server } from "socket.io";
import { Worker } from "worker_threads";
import cameraImageController from "./controllers/cameraImage.controller";
import db from "./database/db";
import messageRoutes from "./routes/message";
import sensorRoutes from "./routes/sensor";
import { constant } from "./utils/constant";
import msg from "./utils/msg";

dotenv.config();

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS || "";
const allowedOriginsArr = allowedOrigins
  .split(",")
  .map((origin) => origin.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOriginsArr,
  },
});

app.use(
  cors({
    origin: allowedOriginsArr,
    allowedHeaders: [
      "access-control-allow-origin",
      "authorization",
      "Pragma",
      "contact",
    ],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.use("/api/sensor", sensorRoutes);
app.use("/api/history", messageRoutes);

const imageWorker = new Worker(
  path.resolve(__dirname + "/workers/imageWorker.js")
);
imageWorker.on("message", async (result) => {
  const bufferData = Buffer.from(result.message.image_data, "binary");

  fs.writeFile(
    `${__dirname}/public/images/${result.message.image_name}`,
    bufferData
  )
    .then(() => {
      console.log("Buffer has been written to file successfully");
      let msgData = {
        sensorStatus: constant.STATUS_ACTIVE,
        msgType: constant.MSG_TYPE_SUB,
        status: constant.MSG_SUCCESS,
        details: "Camera | Detect motion",
      };
      return msg.addMsg(1, result.topic, msgData);
    })
    .then(async () => {
      let res = await cameraImageController.findImageByName(
        result.message.image_name
      );
      return res;
    })
    .then((val) => {
      if (_.isEmpty(val)) {
        let saveImgData = {
          name: result.message.image_name,
          status: constant.STATUS_ACTIVE,
          details: `${result.topic} | ${result.message.image_name}`,
        };
        cameraImageController.saveImage(saveImgData);
      }
    })
    .catch((err) => {
      console.error(err);
      let msgData = {
        sensorStatus: constant.STATUS_ACTIVE,
        msgType: constant.MSG_TYPE_SUB,
        status: constant.MSG_SUCCESS,
        details: `Camera | Error: ${err}`,
      };
      msg.addMsg(1, result.topic, msgData);
    });
});

const worker = new Worker(__dirname + "/workers/mqttWorker.js");
io.on("connection", (socket) => {
  worker.on("message", (result) => {
    socket.emit("temperature", result);

    let msgData = {
      sensorStatus: constant.STATUS_ACTIVE,
      msgType: constant.MSG_TYPE_SUB,
      status: constant.MSG_SUCCESS,
      details: `System Status | Temperature: ${result.message}`,
    };
    msg.addMsg(2, result.topic, msgData);
  });
});

db.sync({ force: false }).then(() => {
  server.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
});
