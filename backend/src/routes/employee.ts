import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { faker } from "@faker-js/faker";

import Employee from "../models/Employee";

const employee = new Hono();

employee.get("/", async c => {
  const employees = await Employee.find({}).select({
    name: true,
    email: true,
    roles: true,
    teams: true,
  });

  return c.json(employees);
});

employee.get("/populate", async c => {
  for (let index = 0; index < 20; index++) {
    const employee = new Employee({
      name: faker.person.fullName(),
      password: faker.internet.password(),
      roles: [faker.person.jobTitle()],
      email: faker.internet.email(),
    });
    await employee.save();
  }
  return c.json(await Employee.find({}));
});

employee.get("/paginate", async c => {
  const { limit, page } = c.req.query();

  if (limit && page) {
    const employees = await Employee.find({})
      .skip(Number(page) * Number(limit))
      .limit(Number(limit));
    return c.json({
      pages: Math.ceil((await Employee.countDocuments()) / Number(limit)), //starts at zero
      employees,
    });
  }

  const employees = await Employee.find({});
  return c.json(employees);
});

employee.get("/:id", async c => {
  const id = c.req.param("id");
  try {
    const employees = await Employee.findById(id).populate("teams");
    return c.json(employees);
  } catch (error) {
    console.log((error as Error).message);
    throw new HTTPException(404, { message: "Employee not found" });
  }
});

export default employee;
