const cookieParser = require("cookie-parser")
const createError = require("http-errors");
const { errors } = require('celebrate');
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");

const mongoose = require("mongoose");
const path = require("path");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const eventRoute = require("./routes/event");

const config = require("./config");

mongoose.connect(
  config.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger(config.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handlers

// celebrate error handler
app.use(errors());

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(8000, () => {
  console.log("Backend server is running!");
});

module.exports = app;
