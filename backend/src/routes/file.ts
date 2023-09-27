import { Hono } from "hono";
import minioClient from "../microservices/minio";
import { HTTPException } from "hono/http-exception";
import File from "../models/File";
import { Types } from "mongoose";
import path from "path";

const file = new Hono();

file.post("/", async c => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  const customName = body.customName;

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = new Types.ObjectId() + path.extname(file.name);

  const cb = async (err: Error) => {
    if (err) throw new HTTPException(400, { message: err.message });
    const newFile = new File({
      fileName,
      originalName: customName !== "" ? customName : file.name,
    });
    await newFile.save();
  };

  minioClient.putObject(
    process.env.MINIO_DEFAULT_BUCKET!,
    fileName,
    buffer,
    cb
  );

  return await c.json(body);
});

export default file;
