import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.headers.authorization.split(" ")[0] === "Bearer" &&
    req.headers.authorization.split(" ")[1];
  try {
    const auth = await jwt.verify(token, process.env.JWT_SECRET);
    if (auth) next();
  } catch (error) {
    res.status(403).json("ungranted");
  }
};
