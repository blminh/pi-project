"use strict";

const { parentPort } = require("worker_threads");
const mqtt = require("mqtt");

const client = mqtt.connect(`${process.env.PI_URL}/${process.env.PI_PORT}`);

client.on("connect", () => {
  console.log("Connect to mqtt!");

  client.subscribe("system/temperature", { qos: 1 }, (err) => {
    if (err) {
      console.error("Subscribe error:", err);
    }
  });
});

client.on("message", (topic, payload) => {
  let message = payload.toString();
  parentPort?.postMessage({
    topic,
    message,
  });
});

client.on("disconnect", () => {
  console.log("Disconnected from MQTT broker");
});

client.on("error", (err) => {
  console.error("MQTT client error:", err);
});

client.on("reconnect", () => {
  console.log("Attempting to reconnect...");
});

client.on("close", () => {
  console.log("MQTT connection closed");
});

process.on("SIGINT", () => {
  client.end(() => {
    console.log("MQTT client disconnected gracefully");
    process.exit(0);
  });
});
