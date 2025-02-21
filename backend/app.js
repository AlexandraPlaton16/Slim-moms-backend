const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "./.env") });

const authRouter = require("./routes/api/users");
const diaryRouter = require("./routes/api/diary");
const categoriesRouter = require("./routes/api/categories");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(
  cors({
    origin: process.env.ORIGIN_CORS_URL || "*",
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/diary", diaryRouter);
app.use("/api/categories", categoriesRouter);

app.use(express.static("public"));

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    code: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
