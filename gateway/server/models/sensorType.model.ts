import { DataTypes } from "sequelize";
import db from "../database/db";
import Sensor from "./sensor.model";

const SensorType = db.define(
  "sensor_types",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      defaultValue: "active",
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

SensorType.hasMany(Sensor);
Sensor.belongsTo(SensorType, { targetKey: "id", foreignKey: "sensor_type_id" });

export default SensorType;
