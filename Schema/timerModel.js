// models/timerModel.js

class TimerModel {
  constructor() {
    this.countdownTime = 2 * 60 + 10; // 2 minutes and 10 seconds
    this.remainingTime = this.countdownTime;
  }

  updateRemainingTime() {
    this.remainingTime -= 1;
    if (this.remainingTime <= 0) {
      this.remainingTime = this.countdownTime; // Reset timer
    }
  }

  getRemainingTime() {
    return this.remainingTime;
  }
}

module.exports = new TimerModel();
