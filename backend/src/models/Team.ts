import mongoose, { Schema, model } from "mongoose";
import Employee from "./Employee";
import startCase from "lodash/startCase";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    employees: {
      type: [mongoose.Types.ObjectId],
      ref: "Employee",
    },
    tasks: [mongoose.Types.ObjectId],
  },
  {
    strict: true,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

teamSchema.pre("save", async function (next) {
  this.employees.map(async employeeId => {
    const employee = await Employee.findById(employeeId);
    if (employee) {
      employee.teams.push(this._id);
      await employee.save();
    }
  });
  return next();
});

const Team = model("Team", teamSchema);

export default Team;
