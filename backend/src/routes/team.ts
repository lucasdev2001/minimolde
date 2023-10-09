import { Hono } from "hono";
import Team from "../models/Team";
const team = new Hono();

team.post("/", async c => {
  const body = await c.req.json();
  const team = new Team(body);
  await team.save();
  return c.json(team);
});

team.get("/:name", async c => {
  const name = await c.req.param("name");

  const team = await Team.findOne({ name }).populate({
    path: "employees",
    select: ["name", "email", "roles"],
  });
  return c.json(team);
});

team.get("/employee/:employee", async c => {
  const employee = await c.req.param("employee");

  console.log("teste");

  const team = await Team.find({ employees: [employee] }).populate({
    path: "employees",
    select: ["name", "email", "roles"],
  });
  return c.json(team);
});

export default team;
