import jwt from "jsonwebtoken";
export default (
  payload: object,
  secret: string,
  expiresIn: number | string
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
};
