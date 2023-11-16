import { Hono } from "hono";
import Notification from "../models/Notification";
import { jwt } from "hono/jwt";
const notification = new Hono();

notification.post("/", async c => {
  const body = await c.req.json();
  await Notification.create(body);
  return c.json("Created succesfully.", 201);
});

notification.get("/", async c => {
  const notifications = await Notification.find({}).populate({
    path: "from",
    select: ["name", "profilePicture"],
  });
  return c.json(notifications);
});

export default notification;
