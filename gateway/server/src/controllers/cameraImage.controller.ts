import expressAsyncHandler from "express-async-handler";
import CameraImage from "../models/cameraImage.model";
import { constant } from "../utils/constant";

const imagesList = expressAsyncHandler(async (req, res) => {
  let data = await CameraImage.findAll();
  res.json(data);
});

const getImage = expressAsyncHandler(async (req, res) => {
  console.log(req.params.id);
  console.log(req.query.id);
  let id: any = req.query.id;
  let data = await CameraImage.findByPk(parseInt(id));
  res.json(data);
});

const addImage = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  let data = {
    ...req.body._value,
    status: constant.STATUS_ACTIVE,
    created_at: Date.now(),
  };
  console.log(data);
  let result = await CameraImage.create(data);
  console.log(result);
  res.json(result);
});

export default { imagesList, addImage, getImage };
