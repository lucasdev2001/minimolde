import * as mqtt from "mqtt";
export const client = mqtt.connect(import.meta.env.VITE_API_BROKER!, {
  password: import.meta.env.VITE_BROKER_PASSWORD,
  username: "client",
});

client.on("connect", () => {
  client.subscribe("notifications", err => console.log(err));
  client.subscribe("teams", err => console.log(err));
  client.subscribe("tasks", err => console.log(err));
});
