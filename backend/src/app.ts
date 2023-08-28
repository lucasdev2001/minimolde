import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import employeeRoute from "./routes/employees";
import authMiddleware from "./routes/middlewares/authMiddleware";
import filesRoute from "./routes/files";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("pong");
});

app.get("/validate-token", authMiddleware, (req, res) => {
  res.status(200).json({ message: "authorized" });
});

app.use("/employees", employeeRoute);
app.use("/files", filesRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Something broke!");
});
