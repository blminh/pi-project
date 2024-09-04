import { DataTypes } from "sequelize";
import db from "../database/db";
import Message from "./message.model";

const Sensor = db.define(
  "sensors",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sensor_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "off",
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

Sensor.hasMany(Message);

export default Sensor;
