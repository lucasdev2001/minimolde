import { Hono } from "hono";
import { cors } from "hono/cors";
import employee from "./routes/employee";
import errorHandler from "./middleware/errorHandler";

const app = new Hono();
app.onError(errorHandler);

app.use("/", cors());

app.get("/", c => c.text("pong 🏓"));

app.route("/employee", employee);

export default app;
