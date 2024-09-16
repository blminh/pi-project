import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Worker } from "worker_threads";
import db from "../database/db";
import CameraImage from "../models/cameraImage.model";
import messageRoutes from "../routes/message";
import sensorRoutes from "../routes/sensor";
import { constant } from "../utils/constant";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8089",
  },
});

app.use(
  cors({
    origin: "http://0.0.0.0:8089",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/../public"));

app.use("/api/sensor", sensorRoutes);
app.use("/api/history", messageRoutes);

const imageWorker = new Worker(__dirname + "/imageWorker.ts");
imageWorker.on("message", async (result) => {
  let data = {
    name: result.image_name,
    status: constant.STATUS_ACTIVE,
  };
  console.log("----------------");
  console.log(data);
  const img = await CameraImage.findOne({
    where: { name: result.image_name },
  });
  if (img === null) {
    await CameraImage.create(data);
  }
});

const worker = new Worker(__dirname + "/mqttWorker.ts");

io.on("connection", (socket) => {
  console.log("a user connected");
  worker.on("message", (result) => {
    console.log(result);
    socket.emit("temperature", result);
  });
});

db.sync({ force: true }).then(() => {
  server.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
});
