import { Hono } from "hono";
import Task from "../models/Task";
const task = new Hono();

task.delete("/:id", async c => {
  await Task.findByIdAndDelete(c.req.param("id"));
  return c.json("Deleted succesfully.", 200);
});

task.put("/:id", async c => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await Task.findByIdAndUpdate(id, body);
  return c.json("Updated succesfully.", 201);
});

task.post("/", async c => {
  const body = await c.req.json();
  await Task.create(body);
  return c.json("Created succesfully.", 201);
});

task.get("/assigned-to/:id", async c => {
  const { title } = c.req.query();

  const id = c.req.param("id");

  const tasks = await Task.find({
    assignedTo: id,
    title: title ? new RegExp(title, "i") : /.*/g,
  }).populate({
    path: "employees",
    select: ["name", "email", "roles", "profilePicture"],
  });

  return c.json(tasks);
});

export default task;
