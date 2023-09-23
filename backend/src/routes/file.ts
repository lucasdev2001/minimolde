import { Hono } from "hono";
import minioClient from "../microservices/minio";
import { HTTPException } from "hono/http-exception";

const file = new Hono();

file.post("/files", async c => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  const buffer = Buffer.from(await file.arrayBuffer());

  minioClient.putObject("minimolde", file.name, buffer, err => {
    if (err) throw new HTTPException(400, { message: err.message });
  });

  return c.json(body);
});

export default file;
