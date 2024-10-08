import { DataTypes } from "sequelize";
import db from "../database/db";
import { constant } from "../utils/constant";
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
      defaultValue: constant.STATUS_ACTIVE,
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

SensorType.hasMany(Sensor);
Sensor.belongsTo(SensorType, { targetKey: "id", foreignKey: "sensor_type_id" });

export default SensorType;
