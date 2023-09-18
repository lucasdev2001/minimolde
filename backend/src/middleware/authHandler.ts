import jwt from "jsonwebtoken";

import { Context, Env, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export default async (c: Context<Env, any, {}>, next: Next) => {
  const token = (c.req.header("authorization")?.split(" ")[0] === "Bearer" &&
    c.req.header("authorization")?.split(" ")[1]) as string;

  jwt.verify(token, process.env.JWT_SECRET!, err => {
    if (err) throw new HTTPException(401, { message: err.message });
    if (!err) next();
  });
};
