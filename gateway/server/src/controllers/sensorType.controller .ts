import expressAsyncHandler from "express-async-handler";
import { QueryTypes } from "sequelize";
import sequelize from "../database/db";
import { constant } from "../utils/constant";

const sensorTypesList = expressAsyncHandler(async (req, res) => {
  let data = await sequelize.query("SELECT * FROM `sensor_types`", {
    type: QueryTypes.SELECT,
  });
  res.json(data);
});

const getSensorType = expressAsyncHandler(async (req, res) => {
  let id: any = req.query.id;
  let data = await sequelize.query(
    "SELECT * FROM `sensor_types` WHERE id = :id",
    {
      type: QueryTypes.SELECT,
      replacements: { id },
    }
  );
  res.json(data);
});

const addSensorType = expressAsyncHandler(async (req, res) => {
  let data = {
    ...req.body._value,
    status: constant.STATUS_ACTIVE,
    created_at: Date.now(),
  };
  let result = await sequelize.query(
    `INSERT INTO sensor_types (name, topic, status, details)
     VALUES (:name, :topic, :status, :details);`,
    {
      type: QueryTypes.INSERT,
      replacements: { ...data },
    }
  );
  res.json(result);
});

const modifySensorType = expressAsyncHandler(async (req, res) => {
  let result = await sequelize.query(
    "UPDATE `sensor_types` SET status = :status WHERE id = :id;",
    {
      type: QueryTypes.UPDATE,
      replacements: { id: req.body.id, status: req.body.status },
    }
  );
});

export default {
  sensorTypesList,
  getSensorType,
  addSensorType,
  modifySensorType,
};
