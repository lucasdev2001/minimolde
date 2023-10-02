import { Hono } from "hono";
import minioClient from "../microservices/minio";
import { HTTPException } from "hono/http-exception";
import File from "../models/File";
import { Types } from "mongoose";
import path from "path";

const file = new Hono();

const { MINIO_DEFAULT_BUCKET } = process.env;

file.post("/", async c => {
  const body = await c.req.parseBody();
  console.log(body);

  const file = body.file as File;
  const customName = body.customName;

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = new Types.ObjectId() + path.extname(file.name);

  const putObjectPromise = new Promise(async (resolve, reject) => {
    minioClient.putObject(
      MINIO_DEFAULT_BUCKET!,
      fileName,
      buffer,
      async err => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });

  await putObjectPromise;

  const newFile = new File({
    fileName,
    originalName: customName ?? file.name,
  });

  await newFile.save();

  return c.json(body, 201);
});

file.get("/", async c => {
  const files = await File.find({}).sort({ originalName: "descending" });
  return c.json(files);
});

file.get("/:fileName", async c => {
  const fileName = c.req.param("fileName");

  const presignedUrlpromise: Promise<string> = new Promise(
    (resolve, reject) => {
      minioClient.presignedUrl(
        "GET",
        MINIO_DEFAULT_BUCKET!,
        fileName,
        (err, presignedUrl) => {
          if (err) return reject(err);
          resolve(presignedUrl);
        }
      );
    }
  );

  const url = await presignedUrlpromise;

  return c.redirect(url);
});

export default file;
