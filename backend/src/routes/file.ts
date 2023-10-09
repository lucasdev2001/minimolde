import { Hono } from "hono";
import minioClient from "../microservices/minio";
import File from "../models/File";
import { Types } from "mongoose";
import path from "path";
import nodemailer from "nodemailer";
const file = new Hono();

const { MINIO_DEFAULT_BUCKET } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "minimolde@minimolde.cloud",
    pass: "GNT3131.b.401",
  },
});

file.get("/email", async c => {
  const info = await transporter.sendMail({
    from: '"Minimolde bot 👻" minimolde@minimolde.cloud', // sender address
    to: "lucasdev2001@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  return c.json("hi");
});

file.post("/", async c => {
  const body = await c.req.parseBody();
  console.log(body);

  const file = body.file as File;
  const customName = body.customName;

  const buffer = Buffer.from(await file.arrayBuffer());
  console.log(buffer);

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
