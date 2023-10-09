import { Schema, model } from "mongoose";
const taskSchema = new Schema(
  {
    title: String,
    description: String,
    assignedTo: [String],
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
  }
);

const Task = model("Task", taskSchema);

export default Task;
