import { Hono } from "hono";
import { cors } from "hono/cors";
import employee from "./routes/employee";
import errorHandler from "./middleware/errorHandler";
import validateToken from "./middleware/validateToken";
import file from "./routes/file";

const app = new Hono();
app.onError(errorHandler);

app.use("/*", cors());

app.get("/validate-token", validateToken);

app.get("/", c => c.text("pong 🏓"));

app.route("/employees", employee);
app.route("/files", file);

export default app;
