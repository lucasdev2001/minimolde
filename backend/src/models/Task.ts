import mongoose, { Schema, model } from "mongoose";
import Employee from "./Employee";
import Team from "./Team";
const taskSchema = new Schema(
  {
    title: String,
    description: String,
    assignedTo: [mongoose.Schema.Types.ObjectId],
    status: {
      type: String,
      enum: ["started", "progress", "completed"],
      default: "started",
    },
  },
  {
    strict: true,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
    },
  }
);

taskSchema.virtual("employees", {
  ref: "Employee",
  localField: "assignedTo",
  foreignField: "_id",

  justOne: false,
});

const Task = model("Task", taskSchema);

export default Task;
