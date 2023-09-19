import { Hono } from "hono";
import { cors } from "hono/cors";
import employee from "./routes/employee";
import errorHandler from "./middleware/errorHandler";
import jwt from "jsonwebtoken";

import { HTTPException } from "hono/http-exception";

const app = new Hono();
app.onError(errorHandler);

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["*"],
  })
);

app.get("/validate-token", (c) => {
  const token = (c.req.header("authorization")?.split(" ")[0] === "Bearer" &&
    c.req.header("authorization")?.split(" ")[1]) as string;

  const verify = jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) throw new Error(err.message);
    if (!err) return decoded;
  });
  console.log(verify);

  return c.json("success", 200);
});

app.get("/", (c) => c.text("pong 🏓"));

app.route("/employee", employee);

export default app;
