import { Hono } from "hono";
import minioClient from "../microservices/minio";
import File from "../models/File";
import { Types } from "mongoose";
import path from "path";
import Employee from "../models/Employee";
const file = new Hono();

const { MINIO_DEFAULT_BUCKET } = process.env;

file.post("/", async c => {
  const body = await c.req.parseBody();

  const file = body.file as File;
  const customName = body.customName;
  const assignedTo = body.assignedTo;

  const name = new Types.ObjectId() + path.extname(file.name);

  const newFile = new File({
    name,
    assignedTo,
    originalName: customName ?? file.name,
  });

  await newFile.save();

  const buffer = Buffer.from(await file.arrayBuffer());

  const putObjectPromise = new Promise((resolve, reject) => {
    minioClient.putObject(MINIO_DEFAULT_BUCKET!, name, buffer, err => {
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
    await newFile.save();
  }

  return c.json("Created succesfully.", 201);
});

file.post("/profile", async c => {
  const body = await c.req.parseBody();

  const file = body.file as File;
  const customName = body.customName;
  const employeeId = body.employeeId;

  const name = new Types.ObjectId() + path.extname(file.name);

  const newFile = new File({
    name,
    originalName: customName ?? file.name,
  });

  await newFile.save();

  await Employee.findByIdAndUpdate(employeeId, {
    $set: {
      profilePicture:
        process.env.SERVER_ADRESS + "files/download/" + newFile.name,
    },
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await new Promise(async (resolve, reject) => {
      minioClient.putObject(MINIO_DEFAULT_BUCKET!, name, buffer, async err => {
        if (err) reject(err);
        resolve(true);
      });
    });
  } catch (error) {
    console.log(error);
  }

  return c.json("Profile picture saved succesfully.", 201);
});

file.get("/assigned-to/:id", async c => {
  const _id = c.req.param("id");

  const files = await File.find({
    assignedTo: _id,
  });

  return c.json(files);
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

file.delete("/:name", async c => {
  const name = c.req.param("name");
  await File.findOneAndDelete({ name });
  await minioClient.removeObject(MINIO_DEFAULT_BUCKET!, name);
  return c.json("succesfully deleted", 200);
});

export default file;
