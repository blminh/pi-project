import expressAsyncHandler from "express-async-handler";
import SystemStatus from "../models/systemStatus.model";

const systemStatus = expressAsyncHandler(async (req, res) => {
  let data = await SystemStatus.findAll();
  res.json(data);
});

export default { systemStatus };
