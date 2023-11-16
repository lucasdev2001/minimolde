import * as dotenv from "dotenv";
import Aedes from "aedes";
import { createServer } from "aedes-server-factory";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const port = Number(process.env.BROKER_PORT);
const wsPort = Number(process.env.BROKER_WSPORT);

const aedes = new Aedes();
const server = createServer(aedes);
const wssServer = createServer(aedes, { ws: true });

aedes.authenticate = function (client, username, password, callback) {
  callback(null, String(password) === process.env.BROKER_PASSWORD!);
};

wssServer.listen(wsPort, () => {
  console.log("web socket listening on port", wsPort);
});

server.listen(port, function () {
  console.log("server started and listening on port ", port);
});
