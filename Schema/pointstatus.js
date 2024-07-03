const mongoose = require('mongoose');

const pointUpdateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pointsProvided: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const PointUpdate = mongoose.model('PointUpdate', pointUpdateSchema);

module.exports = PointUpdate;
