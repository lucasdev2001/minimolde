import { Hono } from "hono";
import Task from "../models/Task";
const task = new Hono();

task.post("/", async c => {
  const body = await c.req.json();
  const task = new Task(body);
  await task.save();
  return c.json("Created succesfully.", 201);
});

task.get("/", async c => {
  const tasks = await Task.find({});
  return c.json(tasks, 200);
});

task.get("/assigned-to/:id", async c => {
  const id = c.req.param("id");
  const tasks = await Task.find({ assignedTo: id });
  return c.json(tasks, 200);
});

export default task;
