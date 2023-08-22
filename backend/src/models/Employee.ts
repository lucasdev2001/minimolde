import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  { strict: true }
);

employeeSchema.pre("save", function () {
  bcrypt
    .hash(this.password, 10)
    .then((hash) => {
      this.password = hash;
    })
    .catch((err) => {
      console.log(err);
    });
});

export default model("employee", employeeSchema);
