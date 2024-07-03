const mongoose = require('mongoose');

// Define schema for spinner history
const SpinnerHistorySchema = new mongoose.Schema({
  singleNumber: {
    type: Number,
    required: true
  },
  doubleNumber: {
    type: Number,
    required: true
  },
  tripleNumber: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a model for spinner history
const SpinnerHistory = mongoose.model('SpinnerHistory', SpinnerHistorySchema);

module.exports= SpinnerHistory