import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    roles: {
      type: Array,
      default: ["researcher"],
    },
  },

  { strict: true }
);

employeeSchema.pre("save", function (next) {
  bcrypt
    .hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

export default model("employee", employeeSchema);
