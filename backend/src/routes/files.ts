import express from "express";
import upload from "./middlewares/storage";
import * as Minio from "minio";
import * as dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const router = express.Router();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

router.post("/:bucket", upload.single("file"), async (req, res) => {
  const bucket = req.params.bucket;
  console.log(bucket);

  const objRes = await minioClient.putObject(
    bucket,
    req.file.originalname,
    req.file.buffer
  );
  console.log(objRes);

  res.status(200).json({ message: "ok" });
});

export default router;
