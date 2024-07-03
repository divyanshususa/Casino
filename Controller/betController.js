const betSchema = require("../Schema/bet");
const Transaction = require("../Schema/transactions");
const User = require("../Schema/user");

exports.placebet = async (req, res) => {
  const { userId, table, numbers, amount } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if user has sufficient points to place the bet
    if (user.userpoints < amount) {
      return res
        .status(400)
        .json({ error: "Insufficient userpoints to place the bet" });
    }

    const updatedUserPoints = user.userpoints - amount;

    await User.findByIdAndUpdate(
      userId,
      { userpoints: updatedUserPoints },
      { new: true }
    );

    const newBet = new betSchema({
      userId,
      table,
      number: numbers,
      amount,
    });

    await newBet.save();

    const transaction = new Transaction({
      userId,
      betId: newBet._id,
      amountPlayed: amount,
      outcome: "loss",
      amountWin: 0,
    });

    await transaction.save();

    res.status(201).json({ message: "Bet placed successfully", bet: newBet });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ error: "Failed to place bet" });
  }
};

exports.checkWiningBets = async (req, res) => {
  try {
    const { userId, singleNumber, doubleNumber, tripleNumber } = req.query;

    const bets = await betSchema.find({ userId, checked: false }).populate('userId');

    const result = {
      single: false,
      double: false,
      triple: false
    };

    let totalWinAmount = 0;
    let totalBets = bets.length;
    let winCount = 0;

    for (const bet of bets) {
      const { _id, table, number, amount } = bet;

      if (table === 'single' && number.includes(singleNumber)) {
        const updatedBet = await betSchema.findByIdAndUpdate(_id, { amountWin: amount * 2, checked: true }, { new: true });
        result.single = true;
        totalWinAmount += amount * 2;
        winCount++;

        await Transaction.findOneAndUpdate(
          { betId: updatedBet._id },
          { outcome: 'win', amountWin: amount * 2 },
          { new: true }
        );

      } else if (table === 'double' && number.includes(doubleNumber)) {
        const updatedBet = await betSchema.findByIdAndUpdate(_id, { amountWin: amount * 3, checked: true }, { new: true });
        result.double = true;
        totalWinAmount += amount * 3;
        winCount++;

        await Transaction.findOneAndUpdate(
          { betId: updatedBet._id },
          { outcome: 'win', amountWin: amount * 3 },
          { new: true }
        );

      } else if (table === 'triple' && number.includes(tripleNumber)) {
        const updatedBet = await betSchema.findByIdAndUpdate(_id, { amountWin: amount * 4, checked: true }, { new: true });
        result.triple = true;
        totalWinAmount += amount * 4;
        winCount++;

        await Transaction.findOneAndUpdate(
          { betId: updatedBet._id },
          { outcome: 'win', amountWin: amount * 4 },
          { new: true }
        );
      }
    }

    // Update user stats
    const user = await User.findById(userId);
    user.gamesPlayed += 1;
    user.gamesLost += (totalBets - winCount);
    user.totalAmountWon += totalWinAmount;
    user.userpoints += totalWinAmount;
    await user.save();

    res.status(200).json({ result, user });
  } catch (error) {
    console.error('Error checking winning numbers:', error);
    res.status(500).json({ error: 'Failed to check winning numbers' });
  }
}