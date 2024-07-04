const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },

  firstname: {
    type: String,
    required: false
  },
  lastname: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },

  userpoints: {
    type: Number,
    required: false
  },


  amountWin: {
    type: Number,
    required: false
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  bets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bet'
  }],

  gamesPlayed: {
    type: Number,
    default: 0
  },
  gamesLost: {
    type: Number,
    default: 0
  },

  totalAmountWon: {
    type: Number,
    default: 0
  }
  ,
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
}, { timestamps: true });


const User = mongoose.model("User", userSchema);

module.exports = User;
