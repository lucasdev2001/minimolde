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
    profilePicture: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: !Number(process.env.PRODUCTION),
    },
  },
  { id: false, strict: true }
);

employeeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const hash = await bcrypt.hash(this.password, 10).then(hash => hash);
    this.password = hash;
    this.profilePicture = `https://picsum.photos/seed/${this.name}/100`;
  }
  return next();
});

const Employee = model("Employee", employeeSchema);

export default Employee;
