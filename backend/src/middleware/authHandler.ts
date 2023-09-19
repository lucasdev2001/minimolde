import jwt from "jsonwebtoken";

import { Context, Env,  } from "hono";
import { HTTPException } from "hono/http-exception";

export default async (c: Context<Env, any, {}>) => {
  const token = (c.req.header("authorization")?.split(" ")[0] === "Bearer" &&
    c.req.header("authorization")?.split(" ")[1]) as string;

  jwt.verify(token, process.env.JWT_SECRET!, err => {
    if (err) throw new HTTPException(401, { message: err.message });
    if (!err) return c.text('success',200)
  });

  await c.json("teste")
};
