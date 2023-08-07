import { app } from "./app";
import { brokerOverWs, broker } from "./broker";
import * as dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const { HTTP_PORT, BROKER_PORT, BROKER_OVER_WS_PORT } = process.env;

const httpServer = app.listen(HTTP_PORT, () =>
  console.log("http server alive 🧟 on port: ", HTTP_PORT)
);

const brokerServer = broker.listen(BROKER_PORT, () => {
  console.log("broker alive 🧟 on port: ", BROKER_PORT);
});

const brokerOverWsServer = brokerOverWs.listen(BROKER_OVER_WS_PORT, () => {
  console.log("broker over websocket alive 🧟 on port: ", BROKER_OVER_WS_PORT);
});

export { httpServer, brokerOverWsServer, brokerServer };
