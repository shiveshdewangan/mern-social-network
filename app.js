const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
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

// bring in routes
const postRoutes = require("./routes/post");

// middlewares
app.use(morgan("dev"));
app.use("/", postRoutes);
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
