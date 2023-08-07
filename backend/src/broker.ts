import * as dotenv from "dotenv";
import path from "node:path";
import Aedes from "aedes";
import { createServer } from "aedes-server-factory";
import mq from "mqemitter";
import mongoose from "mongoose";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

export const emitter = mq();
const aedes = new Aedes({ mq: emitter });

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected!"));

export const broker = createServer(aedes);
export const brokerOverWs = createServer(aedes, { ws: true });
