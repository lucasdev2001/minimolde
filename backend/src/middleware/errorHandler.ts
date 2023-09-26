import { Context, Env } from "hono";
import { HTTPException } from "hono/http-exception";

export default (err: Error, c: Context<Env, any, {}>) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.log(err);
  return c.json(err.message, 500);
};
