import * as mqtt from "mqtt";
export const client = mqtt.connect(process.env.BROKER!, {
  password: process.env.BROKER_PASSWORD,
  username: "server",
});
