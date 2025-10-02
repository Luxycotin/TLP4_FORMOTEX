import type { Request, Response, NextFunction } from "express";
import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();
const API_PREFIX = "/api";

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`${API_PREFIX}/ping`, (_req: Request, res: Response) => {
  res.json({ message: "pong" });
});

app.use(API_PREFIX, routes);

app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use(errorHandler);

export default app; 