import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.headers.authorization.split(" ")[0] === "Bearer" &&
    req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, err => {
    if (err) res.status(401).json({ message: err.message });
    if (!err) next();
  });
};
