import { DataTypes } from "sequelize";
import db from "../database/db";
import { constant } from "../utils/constant";

const CameraImage = db.define(
  "camera_images",
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

export default CameraImage;
