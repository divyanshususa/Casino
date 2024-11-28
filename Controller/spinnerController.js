const SpinnerHistory = require('../Schema/spinner'); // Adjust the path as needed

// Function to replace '0' with '1' in a number
const replaceZeroWithOne = (num) => {
  return parseInt(num.toString().replace(/0/g, '1'));
};

// Spinner endpoint: Generates or retrieves global spinner numbers
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

      // Save the new global spinner result in the database
      const spinnerHistory = new SpinnerHistory({
        ...spinnerResult,
        global: true, // Mark this entry as a global result
        timestamp: new Date(),
      });
      await spinnerHistory.save();
    }

    console.log('Generated/Shared Global Spinner Result:', spinnerResult);

    // Respond with the shared global result
    res.json(spinnerResult);
  } catch (error) {
    console.error('Error in Spinner Endpoint:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get last 5 global spinner results
exports.getSpinnerHistory = async (req, res) => {
  try {
    // Fetch the last 5 global spinner history documents
    const spinnerHistory = await SpinnerHistory.find({ global: true })
      .sort({ timestamp: -1 }) // Sort by latest timestamp
      .limit(5); // Limit to the last 5 entries

    // Map the history records to include required fields
    const result = spinnerHistory.map((entry) => ({
      _id: entry._id, // MongoDB document ID
      singleNumber: entry.singleNumber, // Single number
      doubleNumber: entry.doubleNumber, // Double number
      tripleNumber: entry.tripleNumber, // Triple number
      timestamp: entry.timestamp, // Timestamp of the record
      __v: entry.__v, // Version key from MongoDB
    }));

    // Respond with the mapped result
    res.json(result);
  } catch (error) {
    console.error('Error fetching global spinner history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
