import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new Schema({
  password: String,
});

employeeSchema.pre("save", function () {
  bcrypt
    .hash(this.password, 10)
    .then(hash => {
      this.password = hash;
    })
    .catch(err => {
      console.log(err);
    });
});

export default model("employee", employeeSchema);
