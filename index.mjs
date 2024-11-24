import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import "./config/db.mjs";
import "./config/auth-strategy.mjs";

const app = express();
app.use(express.json());

import authRouter from "./routes/auth.mjs";
import reservationRouter from "./routes/reservations.mjs";
import usersRouter from "./routes/users.mjs";
import productRouter from "./routes/product.js";
import boxRouter from "./routes/box.js";

import passport from "passport";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { authorize } from "./middleware/auth.mjs";

// Session configuration
app.use(
  expressSession({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/products", authorize({ isAdmin: true }), productRouter);
app.use(
  "/uploads",
  authorize(),
  express.static(path.join(__dirname, "uploads"))
);
app.use("/boxes", authorize(), boxRouter);
app.use("/auth", authRouter);
app.use("/reservations", reservationRouter);
app.use("/users", authorize({ isAdmin: true }), usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
