const { parentPort } = require("worker_threads");
const mqtt = require("mqtt");

const client = mqtt.connect("http://0.0.0.0:1883");
client.on("connect", () => {
  console.log("Connect to mqtt!");

  client.subscribe("system/temperature", { qos: 1 }, (err) => {
    if (err) {
      console.error("Subscribe error:", err);
    }
  });
});
let counter = 1;
client.on("message", (topic, payload) => {
  let message = payload.toString();
  console.log(topic);
  console.log(message);
  console.log(counter++);

  parentPort.postMessage({counter: counter++, topic, message: message.toString() });
  client.publish('ack/system/temperature', 'Message received');
  // userMqtt.pubMsg(req.body.id, topic, data);
});

client.on('disconnect', () => {
  console.log('Disconnected from MQTT broker');
});

client.on('error', (err) => {
  console.error('MQTT client error:', err);
});

client.on('reconnect', () => {
  console.log('Attempting to reconnect...');
});

client.on('close', () => {
  console.log('MQTT connection closed');
});

process.on('SIGINT', () => {
  client.end(() => {
    console.log('MQTT client disconnected gracefully');
    process.exit(0);
  });
});