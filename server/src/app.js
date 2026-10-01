import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import productsRouter from "./routes/products.routes.js";
import uploadsRouter from "./routes/uploads.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import addressesRouter from "./routes/addresses.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import cartRouter from "./routes/cart.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import paymentMethodsRouter from "./routes/payment-methods.routes.js";
import proofsRouter from "./routes/proofs.routes.js";
import adminUsersRouter from "./routes/admin-users.routes.js";
import adminOrdersRouter from "./routes/admin-orders.routes.js";
import adminTasksRouter from "./routes/admin-tasks.routes.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(helmet());
// gzip JSON responses (product/order lists are large and highly compressible).
app.use(compression());
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

// Point an external uptime monitor (e.g. UptimeRobot, every 5-10 min) at this:
// the request keeps a sleeping host awake AND runs SELECT 1 so the database
// stays awake too. 503 when the DB is unreachable so the monitor can alert.
app.get("/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "up" });
  } catch (error) {
    console.error(`[health] db check failed: ${error.message}`);
    res.status(503).json({ status: "error", db: "down" });
  }
});

app.use("/api/products", productsRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/addresses", addressesRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payment-methods", paymentMethodsRouter);
app.use("/api/proofs", proofsRouter);
// Admin panel only — read (+ delete) access to customer accounts. Unauthenticated,
// same trust model as the rest of the admin-facing endpoints above.
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/admin/tasks", adminTasksRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
