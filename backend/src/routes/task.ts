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
  const { limit, page } = c.req.query();
  const tasks = await Task.find({})
    .skip(Number(page) * Number(limit))
    .limit(Number(limit));
  const pages = Math.ceil((await Task.countDocuments()) / Number(limit));
  return c.json({
    tasks,
    pages: pages,
  });
});

task.get("/assigned-to/:id", async c => {
  const { limit, page, status, title } = c.req.query();

  const id = c.req.param("id");

  const pages = Math.ceil((await Task.countDocuments()) / Number(limit));
  const tasks = await Task.find({
    assignedTo: id,
    status: status ?? ("started" || "inProgress" || "completed"),
    title: title ? new RegExp(title, "i") : /.*/g,
  })
    .skip(Number(page) * Number(limit))
    .limit(Number(limit));
  return c.json({
    tasks,
    pages: pages, //starts at zero,
  });
});

export default task;
