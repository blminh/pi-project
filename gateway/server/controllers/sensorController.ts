import expressAsyncHandler from "express-async-handler";
import Sensor from "../models/sensor";

const sensorsList = expressAsyncHandler(async (req, res) => {
  let data = await Sensor.findAll();
  res.json(data);
});

const getSensor = expressAsyncHandler(async (req, res) => {
  console.log(req.params.id);
  console.log(req.query.id);
  let id: any = req.query.id;
  let data = await Sensor.findByPk(parseInt(id));
  res.json(data);
});

const addSensor = expressAsyncHandler(async (req, res) => {
  let result = await Sensor.create(req.body);
  res.json(result);
});

const setSensor = expressAsyncHandler(async (req, res) => {
  let result = await Sensor.create(req.body);
  res.json(result);
});

export default { sensorsList, addSensor, getSensor, setSensor };
