const http = require("http");
const path = require("path");

const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const createError = require("http-errors");
const mongoose = require("mongoose");
const logger = require("morgan");
const socketio = require("socket.io");

const config = require("./config");
const messagingIo = require("./io/messaging");
const authRoute = require("./routes/auth");
const chatroomRoute = require("./routes/chatrooms");
const eventRoute = require("./routes/event");
const userRoute = require("./routes/users");

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
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: corsOptions.origin },
});

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

// routes + socketio
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);
app.use("/api/chatrooms", chatroomRoute);

messagingIo.init(io);

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

server.listen(process.env.PORT || 8000, () => {
  console.log("Backend server is running!");
});

module.exports = app;
module.exports.io = io;
