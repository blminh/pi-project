import { DataTypes } from "sequelize";
import db from "../database/db";
import { constant } from "../utils/constant";
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
      allowNull: false,
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
      defaultValue: constant.STATUS_OFF,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
  },
  { timestamps: true }
);

Sensor.hasMany(Message);
Message.belongsTo(Sensor, { targetKey: "id", foreignKey: "sensor_id" });

export default Sensor;
