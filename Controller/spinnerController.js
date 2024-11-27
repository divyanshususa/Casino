let spinnerResult = null;
const betSchema = require('../Schema/bet'); // Adjust the path as needed
const SpinnerHistory = require('../Schema/spinner'); // Adjust the path as needed
exports.spinner = async (req, res) => {
  try {
    const bets = await betSchema.find({ checked: false }).populate("userId");

    let baseCriterion = null;
    const freqCount = {};
    const allNumbers = [];
    const tripleNumbers = [];

    // Step 1: Check if there's a "triple" table in the bets
    for (const bet of bets) {
      if (bet.table === "triple") {
        baseCriterion = "triple";
        tripleNumbers.push(...bet.number);
      }
    }

    // If no "triple" table, check for "double"
    if (!baseCriterion) {
      for (const bet of bets) {
        if (bet.table === "double") {
          baseCriterion = "double";
          allNumbers.push(...bet.number);
        }
      }
    }

    // If no "double" table, check for "single"
    if (!baseCriterion) {
      for (const bet of bets) {
        if (bet.table === "single") {
          baseCriterion = "single";
          allNumbers.push(...bet.number);
        }
      }
    }

    // If no bets found at all, generate random numbers
    if (!baseCriterion) {
      const tripleNumber = Math.floor(Math.random() * 900) + 100;
      const tens = Math.floor((tripleNumber % 100) / 10);
      const singleNumber = tripleNumber % 10;
      const doubleNumber = tens * 10 + singleNumber;

      // Replace any zeros in the number with 1
      const spinnerResult = {
        singleNumber: replaceZeroWithOne(singleNumber),
        doubleNumber: replaceZeroWithOne(doubleNumber),
        tripleNumber: replaceZeroWithOne(tripleNumber)
      };

      const spinnerHistory = new SpinnerHistory({
        userId: null, // or assign a specific userId if needed
        ...spinnerResult,
      });

      await spinnerHistory.save();

      return res.json(spinnerResult);
    }

    // Step 2: Calculate the frequency count of numbers in the baseCriterion
    const numbersToCheck = baseCriterion === "triple" ? tripleNumbers : allNumbers;
    for (const num of numbersToCheck) {
      freqCount[num] = (freqCount[num] || 0) + 1;
    }

    // Find the numbers with the minimum frequency count
    const minFrequency = Math.min(...Object.values(freqCount));
    const leastFrequentNumbers = Object.keys(freqCount).filter(
      (num) => freqCount[num] === minFrequency
    );

    // Choose the maximum number among the least frequent numbers if there's a tie
    const chosenNumber = Math.max(...leastFrequentNumbers.map(Number));

    // Step 3: Extract single number, double number from the chosen number
    const tripleNumber = parseInt(chosenNumber);
    const singleNumber = tripleNumber % 10;
    const tens = Math.floor((tripleNumber % 100) / 10);
    const doubleNumber = tens * 10 + singleNumber;

    // Replace zeros with 1
    const spinnerResult = {
      singleNumber: replaceZeroWithOne(singleNumber),
      doubleNumber: replaceZeroWithOne(doubleNumber),
      tripleNumber: replaceZeroWithOne(tripleNumber)
    };

    const spinnerHistory = new SpinnerHistory({
      userId: null, // or assign a specific userId if needed
      ...spinnerResult,
    });

    await spinnerHistory.save();

    res.json(spinnerResult);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to replace 0 with 1 in a number
const replaceZeroWithOne = (num) => {
  // Convert the number to a string to check for zero digits
  let numStr = num.toString();
  // Replace any '0' with '1'
  numStr = numStr.replace(/0/g, '1');
  // Convert back to an integer
  return parseInt(numStr);
};


exports.getSingleNumberHistory = async (req, res) => {
  try {
    // Retrieve the last 5 spinner history documents for singleNumber
    const singleNumberHistory = await SpinnerHistory.find().sort({ timestamp: -1 }).limit(5);

    res.json(singleNumberHistory);
  } catch (error) {
    console.error('Error fetching singleNumber history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getDoubleNumberHistory = async (req, res) => {
  try {
    // Retrieve the last 5 spinner history documents for doubleNumber
    const doubleNumberHistory = await SpinnerHistory.find().sort({ timestamp: -1 }).limit(5);

    res.json(doubleNumberHistory);
  } catch (error) {
    console.error('Error fetching doubleNumber history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTripleNumberHistory = async (req, res) => {
  try {
    // Retrieve the last 5 spinner history documents for tripleNumber
    const tripleNumberHistory = await SpinnerHistory.find().sort({ timestamp: -1 }).limit(5);

    res.json(tripleNumberHistory);
  } catch (error) {
    console.error('Error fetching tripleNumber history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


