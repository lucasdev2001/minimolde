import Aedes from "aedes";
import { createServer } from "aedes-server-factory";

const port = 1883;

const aedes = new Aedes();
const server = createServer(aedes);
const wssServer = createServer(aedes, { ws: true });

wssServer.listen(8888, () => {
  console.log("listening");
});

server.listen(port, function () {
  console.log("server started and listening on port ", port);
});
