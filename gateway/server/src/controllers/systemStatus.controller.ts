import expressAsyncHandler from "express-async-handler";
import { QueryTypes } from "sequelize";
import sequelize from "../database/db";

const systemStatus = expressAsyncHandler(async (req, res) => {
  let data = await sequelize.query("SELECT * FROM `system_statuses`", {
    type: QueryTypes.SELECT,
  });
  res.json(data);
});

export default { systemStatus };
