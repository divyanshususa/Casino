const mongoose = require('mongoose');

const spinnerSchema = new mongoose.Schema({
  singleNumber: { type: Number, required: true },
  doubleNumber: { type: Number, required: true },
  tripleNumber: { type: Number, required: true },
  global: { type: Boolean, default: false }, // Indicates if this is a global result
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SpinnerHistory', spinnerSchema);
