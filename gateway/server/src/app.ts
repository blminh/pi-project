import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Worker } from "worker_threads";
import db from "../database/db";
import messageRoutes from "../routes/message";
import sensorRoutes from "../routes/sensor";

const app = express();
const server = createServer(app);
const port = 3000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8089",
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/sensor", sensorRoutes);
app.use("/api/history", messageRoutes);

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
