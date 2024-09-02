import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import db from "../database/db";
import messageRoutes from "../routes/message";
import sensorRoutes from "../routes/sensor";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/sensor", sensorRoutes);
app.use("/api/history", messageRoutes);

db.sync().then(() => {
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
});
