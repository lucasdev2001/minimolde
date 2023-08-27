import express from "express";
import employeeModel from "../models/Employee";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  const exists = await employeeModel.exists({
    email: req.body.email,
  });
  if (exists) {
    res.status(409).json(`Email: ${req.body.email} already exists`);
  }

  const employee = new employeeModel(req.body);
  const resBody = {
    name: req.body.name,
    email: req.body.email,
  };

  await employee.save();
  res.status(201).json(resBody);
});

router.post("/auth", async (req, res) => {
  const employee = await employeeModel.findOne({
    email: req.body.email,
  });
  if (!employee) res.status(404).json("No account matches this e-amail");

  const payload = {
    data: {
      name: employee.name,
      email: employee.email,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  const compare = await bcrypt.compare(req.body.password, employee.password);

  if (!compare) res.status(401).json("Wrong e-mail or password");
  res.status(200).json(token);
});

export default router;
