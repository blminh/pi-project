import Message from "../models/message.model";
import { constant } from "./constant";

const addMsg = async (sensor: number, topic: string, data: any) => {
  let msg = {
    sensor_id: sensor,
    sensor_status: data.sensorStatus ?? constant.STATUS_ACTIVE,
    topic,
    message_type: data.msgType,
    status: data.status ?? constant.MSG_SUCCESS,
    details: data.details ?? "",
  };
  await Message.create(msg);
};

export default { addMsg };
