const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://127.0.0.1:1883");

client.subscribe("presence", err => {
  if (!err) {
    client.publish("presence", "Hello mqtt from server");
  }
});

client.on("message", (topic, message) => {
  // message is Buffer
  console.log(message.toString());
  console.log(topic.toString());

  client.end();
});
