import expressAsyncHandler from "express-async-handler";
import Sensor from "../models/sensor.model";
import SensorType from "../models/sensorType.model";
import { constant } from "../utils/constant";
import userMqtt from "../utils/userMqtt";

const sensorsList = expressAsyncHandler(async (req, res) => {
  let data = await Sensor.findAll({ include: [SensorType] });
  res.json(data);
});

const getSensor = expressAsyncHandler(async (req, res) => {
  console.log(req.params.id);
  console.log(req.query.id);
  let id: any = req.query.id;
  let data = await Sensor.findByPk(parseInt(id), { include: [SensorType] });
  res.json(data);
});

const addSensor = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  let data = {
    ...req.body._value,
    status: constant.STATUS_OFF,
    created_at: Date.now(),
  };
  console.log(data);
  let result = await Sensor.create(data);
  console.log(result);
  res.json(result);
});

const setSensor = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  res.json("Receive successfully!");
  // 1. Update db
  await Sensor.update(
    {
      status: req.body.status,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  );

  // 2. mqtt
  let topic = `${req.body.sensor_type.topic}/${req.body.topic}`;
  let data = { status: req.body.status == constant.STATUS_ON ? 1 : 0 };
  userMqtt.pubMsg(req.body.id, topic, data);
});

export default { sensorsList, addSensor, getSensor, setSensor };
