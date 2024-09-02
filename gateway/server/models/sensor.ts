import { DataTypes } from "sequelize";
import db from "../database/db";
import Message from "./message";

const Sensor = db.define("sensors", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  topic: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  details: {
    type: DataTypes.STRING,
  },
});

Sensor.hasMany(Message);

export default Sensor;
