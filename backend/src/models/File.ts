import { Schema, model } from "mongoose";
const fileSchema = new Schema(
  {
    originalName: String,
    name: String,
  },
  { strict: true }
);

const File = model("File", fileSchema);

export default File;
