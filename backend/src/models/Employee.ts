import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: Array,
      default: ["researcher"],
    },
  },
  { strict: true }
);

employeeSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10).then(hash => hash);
  this.password = hash;
  return next();
});

const Employee = model("Employee", employeeSchema);

export default Employee;
