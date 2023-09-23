import { Context, Env } from "hono";
import { HTTPException } from "hono/http-exception";

export default (err: Error, c: Context<Env, any, {}>) => {
  console.error(`${err}`);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json(err.message, 500);
};
