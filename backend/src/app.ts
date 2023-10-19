import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import employee from "./routes/employee";
import errorHandler from "./middleware/errorHandler";
import file from "./routes/file";
import team from "./routes/team";
import task from "./routes/task";
import auth from "./routes/auth";

const app = new Hono();
const secret = process.env.JWT_SECRET!;

app.onError(errorHandler);

app.use("/*", cors());
/* app.use(async (_, next) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  await next();
}); */
app.use("/validate-token", jwt({ secret }));
app.get("/validate-token", c => {
  const payload = c.get("jwtPayload");
  return c.json(payload);
});

app.get("/", c => c.text("pong 🏓"));

app.route("/employees/", employee);
app.route("/teams/", team);
app.route("/tasks", task);
app.route("/auth", auth);

// app.use("/files", jwt({ secret }));
app.route("/files/", file);

export default app;
