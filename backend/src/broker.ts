import * as dotenv from "dotenv";
import path from "node:path";
import Aedes from "aedes";
import mq from "mqemitter";
import employeeHandler from "./controllers/employeeHandler";
import EmployeeModel from "./models/Employee";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

export const emitter = mq({
  concurrency: 5,
});
export const aedes = new Aedes({
  mq: emitter,
  id: "Minimolde Broker",
});

emitter.on("employee/#", employeeHandler);

EmployeeModel.watch().on("change", (stream) => {
  emitter.emit({ topic: "employee/updated", payload: JSON.stringify(stream) });
});
