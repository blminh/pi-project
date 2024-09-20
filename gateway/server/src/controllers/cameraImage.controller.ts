import expressAsyncHandler from "express-async-handler";
import { QueryTypes } from "sequelize";
import sequelize from "../database/db";
import { constant } from "../utils/constant";

const imagesList = expressAsyncHandler(async (req, res) => {
  let data = await sequelize.query("SELECT * FROM `camera_images`", {
    type: QueryTypes.SELECT,
  });
  res.json(data);
});

const getImage = expressAsyncHandler(async (req, res) => {
  let id: any = req.query.id;
  let data = await sequelize.query(
    "SELECT * FROM `camera_images` WHERE id = :id",
    {
      type: QueryTypes.SELECT,
      replacements: { id },
    }
  );
  res.json(data);
});

const addImage = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  let data = {
    ...req.body._value,
    status: constant.STATUS_ACTIVE,
    created_at: Date.now(),
  };
  let result = await sequelize.query(
    `INSERT INTO camera_images (name, status, details)
     VALUES (:name, :status, :details);`,
    {
      type: QueryTypes.INSERT,
      replacements: { ...data },
    }
  );
  res.json(result);
});

export default { imagesList, addImage, getImage };
