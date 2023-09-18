import * as dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { serve } from "@hono/node-server";
import app from "./app";

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HTTP_PORT),
  },
  info => console.log(info)
);
