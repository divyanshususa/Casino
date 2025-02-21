const express_ = require("express");
const app = express_();
const bodyparser = require("body-parser");
const helmet = require("helmet");
var cors = require("cors");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoose = require("mongoose");
const { updateTimer } = require("./Controller/timerController");
require("dotenv").config();

// const uri = 'mongodb+srv://susalabs:susalabs@cluster0.xn0yck9.mongodb.net/?retryWrites=true&w=majority';
const uri =
  "mongodb+srv://susalabs:susalabs@cluster0.xn0yck9.mongodb.net/game?retryWrites=true&w=majority";

exports.connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
// connectToDatabase();
