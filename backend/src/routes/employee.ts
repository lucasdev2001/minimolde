import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { faker } from "@faker-js/faker";

import Employee from "../models/Employee";

const employee = new Hono();

employee.get("/", async c => {
  const { name } = c.req.queries();

  const employees = await Employee.find({
    name: name ? new RegExp(String(name), "i") : /.*/g,
  }).select({
    name: true,
    email: true,
    roles: true,
    teams: true,
    profilePicture: true,
  });

  return c.json(employees);
});

employee.post("/populate", async c => {
  for (let index = 0; index < 20; index++) {
    const employee = new Employee({
      name: faker.person.fullName(),
      password: 123,
      roles: [faker.person.jobTitle()],
      email: faker.internet.email(),
      verified: true,
    });
    await employee.save();
  }
  return c.json(await Employee.find({}));
});

employee.get("/:id", async c => {
  const id = c.req.param("id");
  try {
    const employees = await Employee.findById(id)
      .select({
        name: true,
        email: true,
        teams: true,
        roles: true,
        profilePicture: true,
      })
      .populate("teams");
    return c.json(employees);
  } catch (error) {
    console.log((error as Error).message);
    throw new HTTPException(404, { message: "Employee not found" });
  }
});

employee.delete("/", async c => {
  const body = await c.req.json();

  await Employee.deleteMany({ _id: { $in: body.employees } });
  return c.json("deleted succesfully", 200);
});

export default employee;
