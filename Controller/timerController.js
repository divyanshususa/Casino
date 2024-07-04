const express = require("express");
const TimerModel = require("../Schema/timerModel"); // Adjust the path as needed

llet remainingTime = 131;
let intervalId = null;

const updateTimer = async () => {
  try {
    let timerDoc = await TimerModel.findById("668513f12d91a3f5ae56e44f");
    remainingTime = timerDoc ? timerDoc.remainingTime : 131;
    remainingTime--;
    if (remainingTime < 0) {
      remainingTime = 131;
    }
    await TimerModel.updateOne(
      { _id: "668513f12d91a3f5ae56e44f" },
      { $set: { remainingTime } },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error updating timer:", error);
  }
};

// Start the timer on server startup
intervalId = setInterval(updateTimer, 1000);

// Don't forget to clear the interval when the server is shut down
process.on('exit', () => {
  clearInterval(intervalId);
});

exports.GlobalTimer = async (req, res) => {
  try {
    const timerDoc = await TimerModel.findById("668513f12d91a3f5ae56e44f");
    remainingTime = timerDoc ? timerDoc.remainingTime : 131;
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

// Start the timer on server startup
updateTimer();
