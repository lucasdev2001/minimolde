import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import employee from "./routes/employee";
import errorHandler from "./middleware/errorHandler";
import file from "./routes/file";

const app = new Hono();
const secret = process.env.JWT_SECRET!;

app.onError(errorHandler);

app.use("/*", cors());

app.use("/validate-token", jwt({ secret }));
app.get("/validate-token", c => {
  const payload = c.get("jwtPayload");
  return c.json(payload);
});

app.get("/", c => c.text("pong 🏓"));

app.route("/employees", employee);

// app.use("/files", jwt({ secret }));
app.route("/files", file);

export default app;
