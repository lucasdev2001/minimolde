import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import Employee from "../models/Employee";
import { jwt, decode, verify } from "hono/jwt";
import dayjs from "dayjs";

const auth = new Hono();

const secret = process.env.JWT_SECRET!;

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "minimolde-bot@minimolde.cloud",
    pass: "GNT3131.b.401",
  },
});

auth.post("/", async c => {
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

auth.post("/create-account", async c => {
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
    expiresIn: 60 * 30,
  });

  if (Number(process.env.PRODUCTION)) {
    const validateTokenAdress =
      process.env.CLIENT_ADRESS + "verify-email/" + token;

    const response = await transporter.sendMail({
      from: '"Minimolde bot 👻" minimolde-bot@minimolde.cloud',
      to: employee.email,
      subject: "Verify your minimolde account",
      text: "this link will expire in 30 minutes",
      html: `<a href='${validateTokenAdress}'>confirm e-mail</a>`,
    });
    console.log(response);
  }

  return c.json(token, 201);
});

auth.use("/verify-account", jwt({ secret }));
auth.get("/verify-account", async c => {
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

auth.post("/request-reset-password", async c => {
  const { email } = await c.req.json();

  const employee = await Employee.findOne({ email }).select({
    name: true,
    email: true,
  });

  if (!employee) throw new HTTPException(404, { message: "E-mail not found" });

  const payload = {
    employee,
    exp: dayjs().add(30, "minutes").unix(),
  };
  const secret = process.env.RESET_PASSWORD_SECRET!;
  const token = await sign(payload, secret);

  if (Number(process.env.PRODUCTION)) {
    const validateTokenAdress =
      process.env.CLIENT_ADRESS + "new-password/" + token;

    const response = await transporter.sendMail({
      from: '"Minimolde bot 👻" minimolde-bot@minimolde.cloud',
      to: employee.email,
      subject: "Reset your password",
      text: "this link will expire in 30 minutes",
      html: `<a href='${validateTokenAdress}'>Reset password</a>`,
    });
  }

  console.log(token);

  return c.json("E-mail sent", 200);
});

auth.use(
  "/reset-password",
  jwt({
    secret: process.env.RESET_PASSWORD_SECRET!,
  })
);
auth.put("/reset-password", async c => {
  const { password } = await c.req.json();
  const payload = c.get("jwtPayload");

  const decode = await verify(payload, process.env.RESET_PASSWORD_SECRET!);

  await Employee.findOneAndUpdate(
    { email: decode.email },
    { password: bcrypt.hashSync(String(password), 5) },
    { new: true }
  );

  return c.json("Success", 200);
});

auth.put("/:id", jwt({ secret }), async c => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const employee = await Employee.findById(id);
  if (!employee)
    throw new HTTPException(404, { message: "Employee not found" });

  if (body.password) {
    const comparison = await bcrypt.compare(
      String(body.password),
      employee.password
    );
    if (!comparison) {
      throw new HTTPException(401, { message: "Passwords dosen't match" });
    }
    if (comparison) {
      employee.password = await bcrypt
        .hash(body.newPassword, 10)
        .then(hash => hash);
    }
  }

  if (body.name) {
    employee.name = body.name;
  }

  if (body.email !== employee.email) {
    employee.email = body.email;
    const payload = {
      _id: employee._id,
      name: employee.name,
      email: employee.email,
    };

    const token = await sign(payload, process.env.JWT_SECRET!, {
      expiresIn: 60 * 30,
    });

    if (Number(process.env.PRODUCTION)) {
      const validateTokenAdress =
        process.env.CLIENT_ADRESS + "verify-email/" + token;

      const response = await transporter.sendMail({
        from: '"Minimolde bot 👻" minimolde-bot@minimolde.cloud',
        to: "lucasdev2001@gmail.com",
        subject: "Verify your minimolde account",
        text: "this link will expire in 30 minutes",
        html: `<a href='${validateTokenAdress}'>confirm e-mail</a>`,
      });
      console.log(response);
    }
  }

  await employee.save();
  return c.json("updated", 200);
});

export default auth;
