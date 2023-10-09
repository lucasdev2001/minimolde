import { Schema, model } from "mongoose";
const fileSchema = new Schema(
  {
    originalName: String,
    fileName: String,
    employee: String,
    task: String,
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
