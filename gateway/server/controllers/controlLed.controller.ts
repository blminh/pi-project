import expressAsyncHandler from "express-async-handler";
import mqtt from "mqtt";

const changeItemStatus = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  res.json("Receive successfully!");

  const client = mqtt.connect("http://0.0.0.0:1883");
  client.on("connect", () => {
    console.log("Connect to mqtt!");

    client.publish("control-led", JSON.stringify(req.body), (err) => {
      if (err) {
        console.error("Subscribe error:", err);
      } else {
        console.log("Message published successfully");
      }
      client.end();
    });
  });

  client.on("error", (err) => {
    console.error("Client error:", err);
  });
});

export default { changeItemStatus };
