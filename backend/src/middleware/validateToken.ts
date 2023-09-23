import jwt from "jsonwebtoken";

import { Context, Env } from "hono";
import { HTTPException } from "hono/http-exception";
import signToken from "../utils/signToken";

export default (c: Context<Env, any, {}>) => {
  const token = (c.req.header("authorization")?.split(" ")[0] === "Bearer" &&
    c.req.header("authorization")?.split(" ")[1]) as string;

  const decoded = jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) throw new HTTPException(401, { message: err.message });
    return decoded;
  });

  const { name, email } = decoded!;

  //renew token
  const payload = {
    name,
    email,
  };
  const nwToken = signToken(payload, process.env.JWT_SECRET!, 10 * 60);

  return c.json(nwToken, 200);
};
