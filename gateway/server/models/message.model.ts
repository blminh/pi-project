import { DataTypes } from "sequelize";
import db from "../database/db";

const Message = db.define(
  "messages",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sensor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Sensor",
        key: "id",
      },
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamps: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default Message;
