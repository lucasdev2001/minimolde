import { Hono } from "hono";
import Team from "../models/Team";
const team = new Hono();

team.post("/", async c => {
  const body = await c.req.json();
  const team = new Team(body);
  await team.save();
  return c.json("Created succesfully.", 201);
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
  const { limit, page, name } = c.req.queries();

  const teams = await Team.find({
    name: name ? new RegExp(String(name), "i") : /.*/g,
  })
    .populate({
      path: "employees",
      select: ["name", "email", "roles", "profilePicture"],
    })

    .skip(Number(page) * Number(limit))
    .limit(Number(limit));

  const documentsCount = await Team.countDocuments({
    name: name ? new RegExp(String(name), "i") : /.*/g,
  });

  const pages = Math.ceil(documentsCount / Number(limit));

  return c.json({
    documentsCount,
    pages,
    teams,
  });
});

team.get("/employee/:employee", async c => {
  const employee = await c.req.param("employee");

  const team = await Team.find({ employees: [employee] }).populate({
    path: "employees",
    select: ["name", "email", "roles"],
  });
  return c.json(team);
});

team.delete("/:id", async c => {
  const id = await c.req.param("id");
  await Team.findByIdAndDelete(id);
  c.json("deleted succesfully", 204);
});

export default team;
