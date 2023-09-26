import { Hono } from "hono";
import minioClient from "../microservices/minio";
import { HTTPException } from "hono/http-exception";
import File from "../models/File";
import mongoose, { mongo } from "mongoose";

const file = new Hono();

file.post("/", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  const buffer = Buffer.from(await file.arrayBuffer());

  const name = String(new mongoose.Types.ObjectId() + file.name.split(" ")[1]);

  minioClient.putObject("minimolde", name, buffer, async (err) => {
    if (err) throw new HTTPException(400, { message: err.message });
    const nwFile = new File({
      name,
      originalName: file.name,
    });

    await nwFile.save();
  });

  return c.json(body);
});

export default file;
