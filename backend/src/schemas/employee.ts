import { Schema } from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new Schema(
  {
    name: String,
    email: String,
    password: {
      type: String,
      required: true,
    },
    roles: [],
  },
  { strict: true }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10).then(hash => hash);
    this.password = hash;
    return next();
  }
});
