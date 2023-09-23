import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import bcrypt from "bcrypt";

import Employee from "../models/Employee";
import signToken from "../utils/signToken";

const employee = new Hono();

employee.post("/auth", async c => {
  const body = await c.req.json();
  const employee = await Employee.findOne({
    email: body.email,
  });

  if (!employee)
    throw new HTTPException(401, { message: "wrong email or password" });

  const comparison = await bcrypt.compare(body.password, employee.password);
  const payload = {
    name: employee.name,
    email: employee.email,
  };

  const token = signToken(payload, process.env.JWT_SECRET!, 10 * 60);

  if (!comparison)
    throw new HTTPException(401, { message: "wrong email or password" });
  if (comparison) return c.json(token, 200);
});

employee.post("/", async c => {
  const body = await c.req.json();
  const employee = new Employee(body);
  await employee.save();
  return c.json(
    {
      email: employee.email,
      name: employee.name,
    },
    201
  );
});

export default employee;
