import { Hono } from "hono";
import Employee from "../models/Employee";
const employee = new Hono();

employee.get("/", c => c.text("hi"));

employee.post("/", async c => {
  const body = await c.req.json();
  const employee = new Employee(body);
  await employee.save();
  return c.json(employee, 201);
});

export default employee;
