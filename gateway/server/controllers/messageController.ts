import expressAsyncHandler from "express-async-handler";
import Message from "../models/message";

const messagesList = expressAsyncHandler(async (req, res) => {
  let data = await Message.findAll();
  res.json(data);
});

const getMsg = expressAsyncHandler(async (req, res) => {
  console.log(req.params.id);
  console.log(req.query.id);
  let id: any = req.query.id;
  let data = await Message.findByPk(parseInt(id));
  res.json(data);
});

const addMsg = expressAsyncHandler(async (req, res) => {
  let result = await Message.create(req.body);
  res.json(result);
});

export default { messagesList, addMsg, getMsg };
