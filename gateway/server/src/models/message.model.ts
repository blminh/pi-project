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
      allowNull: true,
    },
    sensor_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export default Message;
