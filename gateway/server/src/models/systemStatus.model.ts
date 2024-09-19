import { DataTypes } from "sequelize";
import db from "../database/db";
import { constant } from "../utils/constant";

const SystemStatus = db.define(
  "system_status",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    usage: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: constant.STATUS_OFF,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export default SystemStatus;
