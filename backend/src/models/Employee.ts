import mongoose, { Schema, model, mongo } from "mongoose";
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
    teams: {
      type: [],
      ref: "Team",
    },
    tasks: [mongoose.Types.ObjectId],
    profilePicture: String || null,
    verified: {
      type: Boolean,
      default: process.env.DEVELOPMENT,
    },
  },
  { strict: true }
);

employeeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const hash = await bcrypt.hash(this.password, 10).then(hash => hash);
    this.profilePicture = `https://picsum.photos/seed/${this.name}/200/300`;
    this.password = hash;
  }
  return next();
});

const Employee = model("Employee", employeeSchema);

Employee.watch().on("change", data => console.log(data));

export default Employee;
