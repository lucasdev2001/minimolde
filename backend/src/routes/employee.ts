import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

import Employee from "../models/Employee";

const employee = new Hono();

employee.post("/auth", async c => {
  const body = await c.req.json();
  const employee = await Employee.findOne({
    email: body.email,
  });

  if (!employee)
    throw new HTTPException(401, { message: "wrong email or password" });

  const comparison = await bcrypt.compare(body.password, employee.password);
  if (!comparison)
    throw new HTTPException(401, { message: "wrong email or password" });

  const payload = {
    name: employee.name,
    email: employee.email,
  };

  const token = await sign(payload, process.env.JWT_SECRET!, { expiresIn: 60 });
  return c.json(token, 200);
});

employee.post("/", async c => {
  const body = await c.req.json();

  const exists = await Employee.exists({ email: body.email });
  if (exists)
    throw new HTTPException(409, { message: "E-mail already exists" });

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
