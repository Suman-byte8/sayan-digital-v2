import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import productsRouter from "./routes/products.routes.js";
import uploadsRouter from "./routes/uploads.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import addressesRouter from "./routes/addresses.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import paymentMethodsRouter from "./routes/payment-methods.routes.js";
import proofsRouter from "./routes/proofs.routes.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    // credentials: true + an explicit origin list (not "*") is required
    // for the refresh-token cookie to actually be sent/accepted cross-origin.
    origin: env.CORS_ORIGINS,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", environment: env.NODE_ENV });
});

app.use("/api/products", productsRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/addresses", addressesRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payment-methods", paymentMethodsRouter);
app.use("/api/proofs", proofsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
