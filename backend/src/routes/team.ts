import { Hono } from "hono";
import Team from "../models/Team";
import Employee from "../models/Employee";
import { HTTPException } from "hono/http-exception";
import { faker } from "@faker-js/faker";
import { jwt } from "hono/jwt";
const team = new Hono();
team.use("/*", jwt({ secret: process.env.JWT_SECRET! }));

team.use("/*", async (c, next) => {
  const method = c.req.method;
  if (method !== "GET") {
    const payload = c.get("jwtPayload");
    const employeeId = payload._id;
    const isEmployeeManager = await Employee.exists({
      _id: employeeId,
      roles: "manager",
    });
    if (isEmployeeManager === null)
      throw new HTTPException(401, { message: "You're not allowed" });
    await next();
  } else {
    await next();
  }
});

team.get("/employee/:employee", async c => {
  const employee = await c.req.param("employee");

  const exists = await Employee.exists({
    _id: employee,
  });

  if (!exists) throw new HTTPException(404, { message: "Employee not found" });

  const team = await Team.find({ employees: employee }).populate({
    path: "employees",
    select: ["name", "email", "roles"],
  });
  return c.json(team, 200);
});

team.get("/:name", async c => {
  const name = await c.req.param("name");

  const team = await Team.findOne({ name: name }).populate({
    path: "employees",
    select: ["name", "email", "roles", "profilePicture"],
  });

  return c.json(team);
});

team.get("/", async c => {
  const teams = await Team.find({})
    .sort({ created_at: -1 })

    .populate({
      path: "employees",
      select: ["name", "email", "roles", "profilePicture"],
    });

  return c.json(teams, 200);
});

team.post("/", async c => {
  const body = await c.req.json();
  const exists = await Team.exists({ name: body.name });
  if (exists)
    throw new HTTPException(409, { message: "Team name already exists" });

  const team = new Team(body);
  await team.save();
  return c.json("Created succesfully.", 201);
});

team.post("/populate", async c => {
  const employees = await Employee.find({});

  for (let index = 0; index < 20; index++) {
    const team = new Team({
      name: faker.company.name(),
      description: faker.company.buzzPhrase(),
      employees: faker.helpers.arrayElements(
        employees.map(employee => employee._id)
      ),
      email: faker.internet.email(),
    });
    await team.save();
  }
  return c.json("Created succesfully.", 201);
});

team.put("/:id", async c => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await Team.findByIdAndUpdate(id, body);
  return c.json("Updated succesfully.", 201);
});

team.delete("/:id", async c => {
  const id = await c.req.param("id");
  await Team.findByIdAndDelete(id);
  return c.json("deleted succesfully", 200);
});

export default team;
