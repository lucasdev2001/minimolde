import { Hono } from "hono";
const employee = new Hono();

employee.get("/", c => c.text("hi"));

export default employee;
