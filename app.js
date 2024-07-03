const express = require("express");
const app = express();
const http = require("http").createServer(app); // Create HTTP server
const socketIo = require("socket.io")(http);

const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoose = require("mongoose");
require("dotenv").config();
const mongoconnect = require("./Config");
const userRoute = require("./Routes/userRoutes");
const path = require("path");
app.use(cors()); // to follow cors policy
app.use(xss()); // safety against XSS attack or Cross Site Scripting attacks
app.use(helmet()); // safety against XSS attack
app.use(express.json({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const timer = require("./Routes/timerRoutes");
const betRoute = require("./Routes/betRoutes");
const spinnerRoute = require("./Routes/spinnerRoutes");
const authenticate = require("./Middlewares/authenticate");
const adminAuth = require("./Middlewares/adminAuthentication");
const adminRoute = require("./Routes/adminRoutes");
const timerController = require("./Controller/timerController");
const port = process.env.PORT || 5000;

try {
  mongoconnect
    .connectToDatabase()
    .then(() => {
      app.listen(port, () =>
        console.log(`Server is up and running at ${port}`)
      );
    })
    .catch((err) => {
      console.log(err);
    });
} catch (err) {
  console.log(err);
}

app.use("/api/user", userRoute);
app.use("/api/bet", betRoute);

app.use("/api/spinner", spinnerRoute);
app.use("/api/admin", adminRoute);

app.use("/api/timer", timer);
// Serve static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("hello");
  res.json("working");
});
