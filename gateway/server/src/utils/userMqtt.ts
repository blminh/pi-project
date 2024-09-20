import mqtt from "mqtt";
import messageController from "../controllers/message.controller";
import { constant } from "./constant";

const pubMsg = (sensor: number, topic: string, data: any) => {
  let msg = {
    sensor_id: sensor,
    topic,
    message_type: constant.MSG_TYPE_PUB,
    status: "",
    details: "",
  };
  const client = mqtt.connect(`${process.env.PI_URL}/${process.env.PI_PORT}`);

  client.on("connect", () => {
    console.log("Connect to mqtt!");

    client.publish(topic, JSON.stringify(data), async (err) => {
      if (err) {
        console.error("Subscribe error:", err);
        msg.status = constant.MSG_ERROR;
        msg.details = "Subscribe error:" + err;
      } else {
        console.log("Message published successfully");
        msg.status = constant.MSG_SUCCESS;
        msg.details = "Message published successfully";
      }

      await messageController.saveMsg(msg);
    });
  });

  client.on("error", (err) => {
    console.error("Client error:", err);
  });
};

export default { pubMsg };
