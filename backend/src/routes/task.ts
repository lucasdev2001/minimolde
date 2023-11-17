import { Hono } from "hono";
import Task from "../models/Task";
import { faker } from "@faker-js/faker";
import Employee from "../models/Employee";
import Team from "../models/Team";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
const task = new Hono();
task.use("/*", jwt({ secret: process.env.JWT_SECRET! }));
task.use("/:id", async (c, next) => {
  const payload = c.get("jwtPayload");
  const method = c.req.method;
  const taskId = c.req.param("id");
  const employeeId = payload._id;

  const task = await Task.findById(taskId);

  if (method === "DELETE" || method === "PUT") {
    const isEmployeeManager = await Employee.exists({
      _id: employeeId,
      roles: "manager",
    });

    const isTaskSelAssignedToEmployee = await Task.exists({
      assignedTo: employeeId,
      _id: taskId,
    });

    if (task?.assignedType === "team") {
      const team = await Team.findById(task.assignedTo);

      if (team?.employees.includes(employeeId)) {
        await next();
      } else {
        throw new HTTPException(404, { message: "you are not allowed" });
      }
    } else {
      const isAllowed = isEmployeeManager || isTaskSelAssignedToEmployee;
      if (isAllowed === null)
        throw new HTTPException(404, { message: "you are not allowed" });
      await next();
    }
  } else {
    await next();
  }
});

task.post("/", async c => {
  const body = await c.req.json();

  await Task.create(body);
  return c.json("Created succesfully.", 201);
});

task.post("/populate", async c => {
  const employees = await Employee.find({});
  const teams = await Team.find({});
  for (let index = 0; index < 20; index++) {
    const task = new Task({
      title: faker.company.buzzPhrase(),
      description: faker.company.buzzPhrase(),
      assignedTo: faker.helpers.arrayElements(
        teams.map(employee => employee._id)
      ),
      status: faker.helpers.arrayElement([
        "started",
        "inProgress",
        "completed",
      ]),
    });
    await task.save();
  }

  for (let index = 0; index < 20; index++) {
    const task = new Task({
      title: faker.company.buzzPhrase(),
      description: faker.company.buzzPhrase(),
      assignedTo: faker.helpers.arrayElements(
        employees.map(employee => employee._id)
      ),
      status: faker.helpers.arrayElement([
        "started",
        "inProgress",
        "completed",
      ]),
    });
    await task.save();
  }

  return c.json("Created succesfully.", 201);
});

task.get("/assigned-to/:id", async c => {
  const id = c.req.param("id");
  const tasks = await Task.find({
    assignedTo: id,
  })
    .sort({ created_at: -1 })
    .populate({
      path: "employees",
      select: ["name", "email", "roles", "profilePicture"],
    });

  return c.json(tasks);
});

task.put("/:id", async c => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await Task.findByIdAndUpdate(id, body, {
    strict: true,
    strictQuery: true,
  });
  return c.json("Updated succesfully.", 201);
});

task.delete("/:id", async c => {
  await Task.findByIdAndDelete(c.req.param("id"));
  return c.json("Deleted succesfully.", 200);
});

export default task;
