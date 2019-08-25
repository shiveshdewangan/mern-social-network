const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
var cookieParser = require('cookie-parser')
dotenv.config();

// db
const MONGO_URI =
  "mongodb://shiveshdewangan:" +
  encodeURIComponent("Sapient@123") +
  "@ds311538.mlab.com:11538/mydb";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch(error => {
    console.log(error);
  });

// bring in routes;
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/user');

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressValidator());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
  handleUnauthorizedLogin(err, req, res, next)
});

function handleUnauthorizedLogin(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: "Unauthorized"
    });
  }
  next();
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});