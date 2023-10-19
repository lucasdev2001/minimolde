import { Hono } from "hono";
import minioClient from "../microservices/minio";
import File from "../models/File";
import { Types } from "mongoose";
import path from "path";
const file = new Hono();

const { MINIO_DEFAULT_BUCKET } = process.env;

file.post("/", async c => {
  const body = await c.req.parseBody();

  const file = body.file as File;
  const customName = body.customName;
  const assignedTo = body.assignedTo;
  console.log(assignedTo);

  const name = new Types.ObjectId() + path.extname(file.name);

  const newFile = new File({
    name,
    assignedTo,
    originalName: customName ?? file.name,
  });

  await newFile.save();

  const buffer = Buffer.from(await file.arrayBuffer());

  const putObjectPromise = new Promise(async (resolve, reject) => {
    minioClient.putObject(MINIO_DEFAULT_BUCKET!, name, buffer, async err => {
      if (err) reject(err);
      resolve(true);
    });
  });

  try {
    await putObjectPromise;
    newFile.status = "completed";
    newFile.save();
  } catch (error) {
    newFile.status = "failed";
    newFile.save();

    console.log(error);
  }

  return c.json(body, 201);
});

file.get("/assigned-to/:id", async c => {
  const { limit, page, name } = await c.req.queries();

  const _id = c.req.param("id");
  console.log(_id);

  const files = await File.find({
    assignedTo: _id,
    name: name ? new RegExp(String(name), "i") : /.*/g,
  })
    .limit(Number(limit))
    .skip(Number(page) * Number(limit));

  const pages = await File.countDocuments({
    assignedTo: _id,
    name: name ? new RegExp(String(name), "i") : /.*/g,
  });

  return c.json({
    files,
    pages,
  });
});

file.delete("/:name", async c => {
  const name = c.req.param("name");
  await File.findOneAndDelete({ name });
  await minioClient.removeObject(MINIO_DEFAULT_BUCKET!, name);
  return c.json("succesfully deleted", 200);
});

file.get("/download/:name", async c => {
  const name = c.req.param("name");

  const presignedUrlpromise: Promise<string> = new Promise(
    (resolve, reject) => {
      minioClient.presignedUrl(
        "GET",
        MINIO_DEFAULT_BUCKET!,
        name,
        1,
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
