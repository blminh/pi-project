import messageController from "../controllers/message.controller";
import { constant } from "./constant";

const addMsg = async (sensor: number, topic: string, data: any) => {
  let msg = {
    sensor_id: sensor,
    topic,
    message_type: data.msgType,
    status: data.status ?? constant.MSG_SUCCESS,
    details: data.details ?? "",
  };
  await messageController.addMsgFromServer(msg);
};

export default { addMsg };
