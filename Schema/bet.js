// models/Bet.js
const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  table: {
    type: String,
    enum: ['single', 'double', 'triple'],
    required: true,
  },
  number: [],
  amount: {
    type: Number,
    required: true,
  },
  amountWin:{
    type:Number,
    required:false
  },

  checked: {
    type: Boolean,
    default: false
  }
},{timestamps:true});

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;
