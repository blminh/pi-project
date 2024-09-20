import { DataTypes } from "sequelize";
import db from "../database/db";
import { constant } from "../utils/constant";

const SystemStatus = db.define(
  "system_statuses",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    usage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
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

export default SystemStatus;
