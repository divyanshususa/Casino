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
      const tripleNumber = 999;
      const tens = Math.floor((tripleNumber % 100) / 10);
      const singleNumber = tripleNumber % 10;
      const doubleNumber = tens * 10 + singleNumber;

      const spinnerResult = { singleNumber, doubleNumber, tripleNumber };

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

    const spinnerResult = { singleNumber, doubleNumber, tripleNumber };

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

// exports.spinner = async (req, res) => {
//   try {
//     const bets = await betSchema.find({ checked: false }).populate("userId");
//     let singleNumber = null;
//     let doubleNumber = null;
//     let tripleNumber = null;
//     let minDigit = Infinity;
//     console.log("bets", bets);
//     for (const bet of bets) {
//       const numbers = bet.number;
//       for (const num of numbers) {
//         const digits = num.toString().split("").map(Number);
//         const minNum = Math.min(...digits);
//         if (minNum < minDigit) {
//           minDigit = minNum;
//           tripleNumber = num;
//         }
//       }
//     }

//     if (!tripleNumber) {
//       for (const bet of bets) {
//         const numbers = bet.number;
//         for (const num of numbers) {
//           const digits = num.toString().split("").map(Number);
//           const secondMinNum = Math.min(...digits.filter((d) => d !== minDigit));
//           if (secondMinNum < minDigit) {
//             minDigit = secondMinNum;
//             tripleNumber = num;
//           }
//         }
//       }
//     }

//     if (!tripleNumber) {
//       for (const bet of bets) {
//         tripleNumber = bet.number[0];
//         break;
//       }
//     }

//     if (!tripleNumber) {
//       tripleNumber = Math.floor(Math.random() * 1000);
//       const tens = Math.floor((tripleNumber % 100) / 10);
//       singleNumber = tripleNumber % 10;
//       doubleNumber = tens * 10 + singleNumber;
//     } else {
//       singleNumber = tripleNumber % 10;
//       const tens = Math.floor((tripleNumber % 100) / 10);
//       doubleNumber = tens * 10 + singleNumber;
//     }

//     const spinnerResult = { singleNumber, doubleNumber, tripleNumber };

//     const spinnerHistory = new SpinnerHistory({
//       userId: null, // or assign a specific userId if needed
//       ...spinnerResult,
//     });

//     await spinnerHistory.save();

//     res.json(spinnerResult);
//   } catch (error) {
//     console.log("Error: ", error);
//     res.status(500).json({ error: error.message });
//   }
// };


// exports.spinner = async (req, res) => {
//   const { userId, table, numbers, amount } = req.body;

//   if (!spinnerResult) {
//     let singleNumber = numbers[0];
//     let doubleNumber = numbers[1];
//     let tripleNumber = null;

//     let minDigit = Infinity;
//     for (const num of numbers) {
//       const digits = num.toString().split("").map(Number);
//       const minNum = Math.min(...digits);
//       if (minNum < minDigit) {
//         minDigit = minNum;
//         tripleNumber = num;
//       }
//     }

//     if (!tripleNumber) {
//       for (const num of numbers) {
//         const digits = num.toString().split("").map(Number);
//         const secondMinNum = Math.min(...digits.filter((d) => d !== minDigit));
//         if (secondMinNum < minDigit) {
//           minDigit = secondMinNum;
//           tripleNumber = num;
//         }
//       }
//     }

//     if (!tripleNumber) {
//       tripleNumber = numbers[0];
//     }

//     spinnerResult = {
//       singleNumber,
//       doubleNumber,
//       tripleNumber,
//     };
//   }

//   const spinnerHistory = new SpinnerHistory({
//     userId,
//     ...spinnerResult,
//   });

//   await spinnerHistory.save();

//   res.json(spinnerResult);
// };


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


