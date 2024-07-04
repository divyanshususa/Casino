const express = require("express");
const TimerModel = require("../Schema/timerModel"); // Adjust the path as needed

let remainingTime = 131;

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
    setTimeout(updateTimer, 1000); // Update every second
  } catch (error) {
    console.error("Error updating timer:", error);
  }
};

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
