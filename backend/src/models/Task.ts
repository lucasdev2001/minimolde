import mongoose, { Schema, model } from "mongoose";
import { client } from "../microservices/broker";
const taskSchema = new Schema(
  {
    title: String,
    description: String,
    assignedTo: [mongoose.Schema.Types.ObjectId],
    status: {
      type: String,
      enum: ["started", "inProgress", "completed"],
      default: "started",
    },
    assignedType: {
      type: String,
      enum: ["self", "employees", "team"],
    },
  },
  {
    id: false,
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

Task.watch().on("change", data => {
  console.log(data);

  client.publish("tasks", "tasks:updated");
});

export default Task;
