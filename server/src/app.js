import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import productsRouter from "./routes/products.routes.js";
import uploadsRouter from "./routes/uploads.routes.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", environment: env.NODE_ENV });
});

app.use("/api/products", productsRouter);
app.use("/api/uploads", uploadsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
