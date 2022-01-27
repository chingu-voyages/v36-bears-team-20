var path = require("path")

const bodyParser = require("body-parser")
const { errors } = require("celebrate")
var cookieParser = require("cookie-parser")
const cors = require("cors")
const dotenv = require("dotenv")
var express = require("express")
const helmet = require("helmet")
var createError = require("http-errors")
const mongoose = require("mongoose")
var logger = require("morgan")
const morgan = require("morgan")
const yup = require("yup")

const authRoute = require("./routes/auth")
const eventRoute = require("./routes/event")
const userRoute = require("./routes/users")

dotenv.config()

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB")
  }
)

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use(cors(corsOptions))

//middleware
app.use(helmet())
app.use(morgan("common"))
app.listen(process.env.PORT || 8000, () => {
  console.log("Backend server is running!")
})
app.use(bodyParser.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/events", eventRoute)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handlers

// celebrate error handler
app.use(errors())

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
