import Aedes from "aedes";
import { createServer } from "aedes-server-factory";

const port = 1883;
const wsPort = 8888;

const aedes = new Aedes();
const server = createServer(aedes);
const wssServer = createServer(aedes, { ws: true });

wssServer.listen(wsPort, () => {
  console.log("web socket listening on port", wsPort);
});

server.listen(port, function () {
  console.log("server started and listening on port ", port);
});
