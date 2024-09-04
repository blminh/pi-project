import expressAsyncHandler from "express-async-handler";
import SensorType from "../models/sensorType.model";

const sensorTypesList = expressAsyncHandler(async (req, res) => {
  let data = await SensorType.findAll();
  res.json(data);
});

const getSensorType = expressAsyncHandler(async (req, res) => {
  console.log(req.params.id);
  console.log(req.query.id);
  let id: any = req.query.id;
  let data = await SensorType.findByPk(parseInt(id));
  res.json(data);
});

const addSensorType = expressAsyncHandler(async (req, res) => {
  let data = {
    ...req.body._value,
    created_at: Date.now(),
  };
  console.log(data);
  let result = await SensorType.create(data);
  res.json(result);
});

const modifySensorType = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  res.json("Receive successfully!");
  // 1. Update db
  await SensorType.update(
    {
      status: req.body.status,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  );
});

export default {
  sensorTypesList,
  getSensorType,
  addSensorType,
  modifySensorType,
};
