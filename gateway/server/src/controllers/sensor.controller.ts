import expressAsyncHandler from "express-async-handler";
import { QueryTypes } from "sequelize";
import sequelize from "../database/db";
import { constant } from "../utils/constant";
import userMqtt from "../utils/userMqtt";

let includeSensorAndType = (data: any) =>
  data.map((el: any) => ({
    id: el.sensor_id,
    name: el.sensor_name,
    topic: el.sensor_topic,
    status: el.sensor_status,
    details: el.sensor_details,
    createdAt: el.sensor_createAt,
    updatedAt: el.sensor_updated_at,
    sensor_type: {
      id: el.sensor_type_id,
      name: el.sensor_type_name,
      topic: el.sensor_type_topic,
      status: el.sensor_type_status,
    },
  }));

const sensorsList = expressAsyncHandler(async (req, res) => {
  let data = await sequelize.query(
    `SELECT sensors.id AS sensor_id,
            sensor_type_id,
            sensors.name AS sensor_name,
            sensors.topic AS sensor_topic,
            sensors.status AS sensor_status,
            sensors.details AS sensor_details,
            sensors.created_at AS sensor_create_at,
            sensors.updated_at AS sensor_updated_at,
            sensor_types.name AS sensor_type_name,
            sensor_types.topic AS sensor_type_topic,
            sensor_types.status AS sensor_type_status
     FROM sensors
     INNER JOIN sensor_types ON sensor_type_id = sensor_types.id;`,
    {
      type: QueryTypes.SELECT,
      mapToModel: true,
      nest: true,
    }
  );

  res.json(includeSensorAndType(data));
});

const getSensor = expressAsyncHandler(async (req, res) => {
  let id = req.query.id;
  let data = await sequelize.query(
    `SELECT sensors.id AS sensor_id,
            sensor_type_id,
            sensors.name AS sensor_name,
            sensors.topic AS sensor_topic,
            sensors.status AS sensor_status,
            sensors.details AS sensor_details,
            sensors.created_at AS sensor_createAt,
            sensors.updated_at AS sensor_updated_at,
            sensor_types.name AS sensor_type_name,
            sensor_types.topic AS sensor_type_topic,
            sensor_types.status AS sensor_type_status
     FROM sensors
     INNER JOIN sensor_types ON sensor_type_id = sensor_types.id
     WHERE sensor_id = :id;`,
    {
      type: QueryTypes.SELECT,
      mapToModel: true,
      nest: true,
      replacements: { id },
    }
  );

  res.json(includeSensorAndType(data));
});

const addSensor = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  let data = {
    ...req.body._value,
    status: constant.STATUS_OFF,
    created_at: Date.now(),
  };
  let result = await sequelize.query(
    `INSERT INTO sensors (sensor_type_id, name, topic, status, details)
     VALUES (:sensor_type_id, :name, :topic, :status, :details);`,
    {
      type: QueryTypes.INSERT,
      replacements: { ...data },
    }
  );
  res.json(result);
});

const setSensor = expressAsyncHandler(async (req, res) => {
  // 1. update db
  await sequelize.query(
    "UPDATE `sensors` SET status = :status WHERE id = :id;",
    {
      type: QueryTypes.UPDATE,
      replacements: { id: req.body.id, status: req.body.status },
    }
  );

  // 2. mqtt
  let topic = `${req.body.sensor_type.topic}/${req.body.topic}`;
  let data = { status: req.body.status == constant.STATUS_ON ? 1 : 0 };
  userMqtt.pubMsg(req.body.id, topic, data);
});

export default { sensorsList, addSensor, getSensor, setSensor };
