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

const findImageById = async (id: number) => {
  const result = sequelize.query(
    "SELECT * FROM `camera_images` WHERE id = :id",
    {
      type: QueryTypes.SELECT,
      replacements: { id },
    }
  );
  return result;
};

const findImageByName = async (name: string) => {
  const result = sequelize.query(
    "SELECT * FROM `camera_images` WHERE name = :name",
    {
      type: QueryTypes.SELECT,
      replacements: { name },
    }
  );
  return result;
};

const getImage = expressAsyncHandler(async (req, res) => {
  let id: any = req.query.id;
  let data = await findImageById(id);
  res.json(data);
});

const saveImage = async (data: any) => {
  let saveData = {
    ...data,
    status: constant.STATUS_ACTIVE,
    created_at: Date.now(),
  };

  const result = sequelize.query(
    `INSERT INTO camera_images (name, status, details)
     VALUES (:name, :status, :details);`,
    {
      type: QueryTypes.INSERT,
      replacements: { ...saveData },
    }
  );
  return result;
};

const addImage = expressAsyncHandler(async (req, res) => {
  let result = await saveImage(req.body);
  res.json(result);
});

export default {
  imagesList,
  addImage,
  saveImage,
  getImage,
  findImageById,
  findImageByName,
};
