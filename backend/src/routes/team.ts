import { Hono } from "hono";
import Team from "../models/Team";
import Employee from "../models/Employee";
import { HTTPException } from "hono/http-exception";
const team = new Hono();

team.post("/", async c => {
  const body = await c.req.json();
  const team = new Team(body);
  await team.save();
  return c.json("Created succesfully.", 201);
});

team.put("/:id", async c => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await Team.findByIdAndUpdate(id, body);
  return c.json("Updated succesfully.", 201);
});

team.get("/employee/:employee", async c => {
  const employee = await c.req.param("employee");

  const exists = await Employee.exists({
    _id: employee,
  });

  console.log(exists, 9000);

  if (!exists) throw new HTTPException(404, { message: "Employee not found" });

  const team = await Team.find({ employees: employee }).populate({
    path: "employees",
    select: ["name", "email", "roles"],
  });
  return c.json(team);
});

team.get("/:name", async c => {
  const name = await c.req.param("name");

  const team = await Team.findOne({ name }).populate({
    path: "employees",
    select: ["name", "email", "roles", "profilePicture"],
  });
  return c.json(team);
});

team.get("/", async c => {
  const { name } = c.req.queries();

  const teams = await Team.find({
    name: name ? new RegExp(String(name), "i") : /.*/g,
  }).populate({
    path: "employees",
    select: ["name", "email", "roles", "profilePicture"],
  });

  return c.json(teams);
});

team.delete("/:id", async c => {
  const id = await c.req.param("id");
  await Team.findByIdAndDelete(id);
  return c.json("deleted succesfully", 200);
});

export default team;
