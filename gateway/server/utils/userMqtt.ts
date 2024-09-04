import mqtt from "mqtt";

const pubMsg = (topic: any, data: any) => {
  console.log(`Topic: ${topic}`);
  console.log(`Data:`);
  console.log(data);
  const client = mqtt.connect("http://0.0.0.0:1883");
  client.on("connect", () => {
    console.log("Connect to mqtt!");

    client.publish(topic, JSON.stringify(data), (err) => {
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
};

export default { pubMsg };
