import { Hono } from "hono";

const app = new Hono();
app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Custom Error Message", 500);
});

app.get("/search", c => {
  const query = c.req.query("sort");

  return c.json({ hi: "there" });
});

export default app;
