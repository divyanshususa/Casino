const SpinnerHistory = require('../Schema/spinner'); // Adjust the path as needed

// Function to replace '0' with '1' in a number
const replaceZeroWithOne = (num) => {
  return parseInt(num.toString().replace(/0/g, '1'));
};

// Spinner endpoint: Generates or retrieves common spinner numbers
exports.spinner = async (req, res) => {
  try {
    // Check if a spinner result exists within the last minute
    const latestEntry = await SpinnerHistory.findOne().sort({ timestamp: -1 });

    let spinnerResult;
    const now = new Date();

    if (latestEntry && (now - latestEntry.timestamp) < 60000) {
      // If the numbers were generated within the last minute, reuse them
      spinnerResult = {
        singleNumber: latestEntry.singleNumber,
        doubleNumber: latestEntry.doubleNumber,
        tripleNumber: latestEntry.tripleNumber,
      };
    } else {
      // Generate new random numbers if no recent result exists
      const tripleNumber = replaceZeroWithOne(Math.floor(Math.random() * 900) + 100); // Random number (100-999)
      const singleNumber = replaceZeroWithOne(tripleNumber % 10); // Extract last digit
      const tens = Math.floor((tripleNumber % 100) / 10); // Tens digit
      const doubleNumber = replaceZeroWithOne(tens * 10 + singleNumber); // Last two digits

      spinnerResult = { singleNumber, doubleNumber, tripleNumber };

      // Save the new spinner result in the database
      const spinnerHistory = new SpinnerHistory({
        ...spinnerResult,
      });
      await spinnerHistory.save();
    }

    console.log('Generated/Shared Spinner Result:', spinnerResult);

    // Respond with the shared result
    res.json(spinnerResult);
  } catch (error) {
    console.error('Error in Spinner Endpoint:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get last 5 singleNumber results
exports.getSingleNumberHistory = async (req, res) => {
  try {
    const singleNumberHistory = await SpinnerHistory.find()
      .sort({ timestamp: -1 }) // Most recent first
      .limit(5);
    const result = singleNumberHistory.map(entry => ({
      singleNumber: entry.singleNumber,
      timestamp: entry.timestamp
    }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching singleNumber history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get last 5 doubleNumber results
exports.getDoubleNumberHistory = async (req, res) => {
  try {
    const doubleNumberHistory = await SpinnerHistory.find()
      .sort({ timestamp: -1 })
      .limit(5);
    const result = doubleNumberHistory.map(entry => ({
      doubleNumber: entry.doubleNumber,
      timestamp: entry.timestamp
    }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching doubleNumber history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get last 5 tripleNumber results
exports.getTripleNumberHistory = async (req, res) => {
  try {
    const tripleNumberHistory = await SpinnerHistory.find()
      .sort({ timestamp: -1 })
      .limit(5);
    const result = tripleNumberHistory.map(entry => ({
      tripleNumber: entry.tripleNumber,
      timestamp: entry.timestamp
    }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching tripleNumber history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
