import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { faker } from "@faker-js/faker";

import Employee from "../models/Employee";
import { isEmpty, lowerCase, replace } from "lodash";
import { jwt } from "hono/jwt";

const employee = new Hono();

employee.use("/*", jwt({ secret: process.env.JWT_SECRET! }));

employee.use("/*", async (c, next) => {
  const payload = c.get("jwtPayload");
  const employeeId = payload._id;
  if (c.req.method !== "GET") {
    const isEmployeeManager = await Employee.findOne({
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

employee.get("/", async c => {
  const employees = await Employee.find().select({
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

employee.put("/:id", async c => {
  const id = c.req.param("id");
  const body = await c.req.json();

  let roles: string | string[] = body.roles as string;

  const employee = await Employee.findById(id);
  if (!employee)
    throw new HTTPException(404, { message: "Employee not found" });

  roles = roles.split(",");
  roles = roles.filter(role => !isEmpty(role));
  roles.map(role => role.replace(/\s/g, ""));
  roles = [...new Set(roles)];

  roles = roles.map(role => lowerCase(role!));
  employee.roles = roles;
  await employee.save();

  return c.json("updated", 200);
});

employee.delete("/", async c => {
  const body = await c.req.json();

  await Employee.deleteMany({ _id: { $in: body.employees } });
  return c.json("deleted succesfully", 200);
});

export default employee;
