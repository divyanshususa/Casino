const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  betId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bet',
    required: true
  },

  amountPlayed:{
type:Number,
required: true
  },

  outcome:{

type: String,
enum: ['win', 'loss'],
default:"loss"
  },
  amountWin: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}
,{timestamps:true}
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
