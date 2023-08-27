import express, {
  Response,
  Request,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import cors from "cors";
import employeeRoute from "./routes/employees";
import AuthMiddleware from "./routes/middlewares/AuthMiddleware";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("pong");
});

app.post("/token", AuthMiddleware, (req, res) => {
  res.status(200).send(req.body);
});

app.use("/employees", employeeRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Something broke!");
});
