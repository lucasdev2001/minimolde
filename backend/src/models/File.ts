import { Schema, model } from "mongoose";
const fileSchema = new Schema(
  {
    originalName: String,
    name: String,
    employee: String,
    task: String,
    status: {
      type: String,
      enum: ["uploading", "completed", "failed"],
      default: "uploading",
    },
    assignedTo: String,
  },
  {
    strict: true,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const File = model("File", fileSchema);

export default File;
