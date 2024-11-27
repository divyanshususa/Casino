const TimerModel = require("../Schema/timerModel");

let remainingTime = 131;
let timerRunning = false; // Prevent duplicate timers

const initializeTimer = async () => {
  try {
    const timerDoc = await TimerModel.findById("668513f12d91a3f5ae56e44a");
    remainingTime = timerDoc ? timerDoc.remainingTime : 131;
  } catch (error) {
    console.error("Error initializing timer:", error);
  }
};

const startGlobalTimer = (io) => {
  if (timerRunning) return; // Prevent duplicate timers
  timerRunning = true;

  setInterval(async () => {
    remainingTime--;

    if (remainingTime < 0) {
      remainingTime = 131; // Reset the timer
    }

    console.log(`Global Timer: ${remainingTime}s remaining`);
    io.emit("timerUpdate", { remainingTime });

    if (remainingTime % 30 === 0) {
      try {
        await TimerModel.updateOne(
          { _id: "668513f12d91a3f5ae56e44a" },
          { $set: { remainingTime } },
          { upsert: true }
        );
        console.log(`Timer synced to database at ${remainingTime}s remaining`);
      } catch (error) {
        console.error("Error syncing timer to the database:", error);
      }
    }
  }, 1000); // Update every second
};

module.exports = { initializeTimer, startGlobalTimer, getRemainingTime: () => remainingTime };
