import mqtt from "mqtt";
import Message from "../models/message.model";
import { constant } from "./constant";

const pubMsg = (sensor: number, topic: string, data: any) => {
  let msg = {
    sensor_id: sensor,
    sensor_status: data.status == 1 ? constant.STATUS_ON : constant.STATUS_OFF,
    topic,
    message_type: constant.MSG_TYPE_PUB,
    status: "",
    details: "",
    timestamps: "",
  };
  const client = mqtt.connect("http://192.168.200.9:1883");
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

      await Message.create(msg);
    });
  });

  client.on("error", (err) => {
    console.error("Client error:", err);
  });
};

export default { pubMsg };
