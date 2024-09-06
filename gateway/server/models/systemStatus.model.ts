import { DataTypes } from "sequelize";
import db from "../database/db";

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
      defaultValue: "off",
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export default SystemStatus;
