import { DataTypes } from "sequelize";
import db from "../database/db";

const Message = db.define("messages", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sensorId: {
    type: DataTypes.INTEGER,
    references: {
      model: "sensors",
      key: "id",
    },
  },
  details: {
    type: DataTypes.STRING,
  },
  timeStamp: {
    type: DataTypes.TEXT,
  },
});

export default Message;
