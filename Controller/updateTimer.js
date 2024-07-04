const express = require("express");
const TimerModel = require('../Schema/timerModel'); // Adjust the path as needed

const updateTimer = async () => {
    try {
        let timerDoc = await TimerModel.findById("668513f12d91a3f5ae56e44f");
        let remainingTime = timerDoc ? timerDoc.remainingTime : 131;
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
}
module.exports = { updateTimer };
