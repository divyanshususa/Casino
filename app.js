const express = require("express");
const app = express();
const http = require("http"); // Import the HTTP module correctly
const server = http.createServer(app); // Use the HTTP module to create a server

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

const betRoute = require("./Routes/betRoutes");
const spinnerRoute = require("./Routes/spinnerRoutes");
const authenticate = require("./Middlewares/authenticate");
const adminAuth = require("./Middlewares/adminAuthentication");
const adminRoute = require("./Routes/adminRoutes");
const socketIo = require("socket.io");

const { initializeTimer, startGlobalTimer, getRemainingTime } = require("./Controller/timerController");

const io = socketIo(server); // Pass the HTTP server to socket.io
const port = process.env.PORT || 5000;

mongoconnect.connectToDatabase().then(async () => {
  // Initialize the timer from the database
  await initializeTimer();

  // Start the timer and pass the Socket.IO instance
  startGlobalTimer(io);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch((err) => {
  console.error("Database connection error:", err);
});

// Handle new client connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Send current timer value to the newly connected client
  socket.emit("timerUpdate", { remainingTime });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use("/api/user", userRoute);
app.use("/api/bet", betRoute);

app.use("/api/spinner", spinnerRoute);
app.use("/api/admin", adminRoute);

// Add API route to get the current timer value
app.get("/api/timer", (req, res) => {
  const remainingTime = getRemainingTime(); // Use the getter function
  res.json({ remainingTime });
});


// app.use("/api/timer", timer);
// Serve static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("hello");
  res.json("working");
});
