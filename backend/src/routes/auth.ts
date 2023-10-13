import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import Employee from "../models/Employee";
import { jwt, decode } from "hono/jwt";
import jwtDecode from "jwt-decode";

const auth = new Hono();

const secret = process.env.JWT_SECRET!;

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "minimolde@minimolde.cloud",
    pass: "GNT3131.b.401",
  },
});

auth.post("/", async (c) => {
  const body = await c.req.json();
  const employee = await Employee.findOne({
    email: body.email,
  });

  if (!employee)
    throw new HTTPException(401, { message: "wrong email or password" });

  if (!employee.verified)
    throw new HTTPException(401, {
      message: "Unverified account",
    });

  const comparison = await bcrypt.compare(
    String(body.password),
    employee.password
  );
  if (!comparison)
    throw new HTTPException(401, { message: "wrong email or password" });

  const payload = {
    _id: employee._id,
    name: employee.name,
    email: employee.email,
  };

  const token = await sign(payload, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60,
  });
  return c.json(token, 200);
});

auth.post("/create-account", async (c) => {
  const body = await c.req.json();

  const exists = await Employee.exists({ email: body.email });
  if (exists)
    throw new HTTPException(409, { message: "E-mail already exists" });

  const employee = new Employee(body);
  await employee.save();

  const payload = {
    _id: employee._id,
    name: employee.name,
    email: employee.email,
  };

  const token = await sign(payload, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60,
  });

  if (Number(process.env.PRODUCTION)) {
    await transporter.sendMail({
      from: '"Minimolde bot 👻" minimolde@minimolde.cloud',
      to: "lucasdev2001@gmail.com",
      subject: "Verify your minimolde account",
      text: "this link will expire in 30 minutes",
      html: `<b>Here is your verification link</b>`,
    });
  }

  return c.json(token, 201);
});

auth.use("/verify-account", jwt({ secret }));
auth.get("/verify-account", async (c) => {
  const authorization = c.req.header("Authorization");
  if (!authorization)
    throw new HTTPException(409, { message: "Missing token" });

  const token = authorization.split("Bearer ")[1];
  const decoded = decode(token);

  const employeeId = decoded.payload._id;

  await Employee.findByIdAndUpdate(employeeId, {
    verified: true,
  });

  return c.json("verified", 200);
});

export default auth;
