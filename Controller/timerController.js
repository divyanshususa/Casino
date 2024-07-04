const express = require("express");
const TimerSync = require('../Schema/timerModel'); // Adjust the path as needed


exports.GlobalTimer = async (req, res) => {
  try {
    const timerDoc = await TimerSync.findOne({ _id: "668513f12d91a3f5ae56e44f" });
    const remainingTime = timerDoc ? timerDoc.remainingTime : 131;
    // Calculate remaining time in minutes and seconds for JSON output
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const response = {
      remainingTime: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching global timer data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};


// Function to update remaining time and reset after 2 minutes 10 seconds
// function updateTimer() {
//   remainingTime--;
//   if (remainingTime === 0) {
//     remainingTime = 131;
//   }
//   setTimeout(updateTimer, 1000); // Update every second
// }

// // Start the timer on server startup
// updateTimer();

// exports.GlobalTimer = async (req, res) => {
//   try {
//     // Calculate remaining time in minutes and seconds for JSON output
//     const minutes = Math.floor(remainingTime / 60);
//     const seconds = remainingTime % 60;
//     const response = {
//       remainingTime: `${minutes}:${seconds.toString().padStart(2, "0")}`,
//     };
//     res.json(response);
//   } catch (error) {
//     console.error("Error fetching global timer data:", error);
//     res.status(500).json({ message: "Error fetching data" });
//   }
// };
