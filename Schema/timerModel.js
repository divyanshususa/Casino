const mongoose = require('mongoose');

// Define schema for spinner history
const TimerSchema = new mongoose.Schema({
  remainingTime: {
    type: Number
  },
});

// Create a model for spinner history
const TimerModel = mongoose.model('TimerModel', TimerSchema);

module.exports = TimerModel