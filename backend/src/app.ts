import express from "express";
import { emitter } from "./broker";
import cors from "cors";

export const app = express();

app.use(cors());
app.use(express.json());
