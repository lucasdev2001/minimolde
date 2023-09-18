import * as dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import mongoose from "mongoose";

import { serve } from "@hono/node-server";
import app from "./app";
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(conn =>
    console.log(`database conn stat:`, conn.ConnectionStates.connected)
  )
  .catch(err => console.log(err));
serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HTTP_PORT),
  },
  info => console.log(info)
);
