import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { faker } from "@faker-js/faker";

import Employee from "../models/Employee";

const employee = new Hono();

employee.get("/", async c => {
  const { limit, page, name } = c.req.queries();

  const employees = await Employee.find({
    name: name ? new RegExp(String(name), "i") : /.*/g,
  })
    .select({
      name: true,
      email: true,
      roles: true,
      teams: true,
      profilePicture: true,
    })
    .skip(Number(page) * Number(limit))
    .limit(Number(limit));

  const documentsCount = await Employee.countDocuments({
    name: name ? new RegExp(String(name), "i") : /.*/g,
  });

  const pages = Math.ceil(documentsCount / Number(limit));

  return c.json({
    documentsCount,
    pages,
    employees,
  });
});

employee.post("/populate", async c => {
  for (let index = 0; index < 20; index++) {
    const employee = new Employee({
      name: faker.person.fullName(),
      password: 123,
      roles: [faker.person.jobTitle()],
      email: faker.internet.email(),
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

export default employee;
