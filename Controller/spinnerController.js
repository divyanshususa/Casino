const betSchema = require('../Schema/bet'); // Adjust the path as needed
const SpinnerHistory = require('../Schema/spinner'); // Adjust the path as needed

// Function to replace '0' with '1' in a number
const replaceZeroWithOne = (num) => {
  return parseInt(num.toString().replace(/0/g, '1'));
};

// Spinner endpoint: Generates random numbers and saves the result
exports.spinner = async (req, res) => {
  try {
    // Generate a random triple number (100-999) and replace zeros
    const tripleNumber = replaceZeroWithOne(Math.floor(Math.random() * 900) + 100);

    // Extract singleNumber and doubleNumber from the tripleNumber
    const singleNumber = replaceZeroWithOne(tripleNumber % 10); // Last digit
    const tens = Math.floor((tripleNumber % 100) / 10); // Tens digit
    const doubleNumber = replaceZeroWithOne(tens * 10 + singleNumber); // Last two digits

    // Build the spinner result
    const spinnerResult = { singleNumber, doubleNumber, tripleNumber };
    console.log("Generated Spinner Result:", spinnerResult);

    // Save the result to the database
    const spinnerHistory = new SpinnerHistory({
      userId: null, // or assign a specific userId if needed
      ...spinnerResult,
    });
    await spinnerHistory.save();

    // Respond with the result
    res.json(spinnerResult);
  } catch (error) {
    console.error("Error in Spinner Endpoint:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get last 5 singleNumber results
exports.getSingleNumberHistory = async (req, res) => {
  try {
    const singleNumberHistory = await SpinnerHistory.find()
      .sort({ timestamp: -1 }) // Most recent first
      .limit(5);
    res.json(singleNumberHistory);
  } catch (error) {
    console.error("Error fetching singleNumber history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get last 5 doubleNumber results
exports.getDoubleNumberHistory = async (req, res) => {
  try {
    const doubleNumberHistory = await SpinnerHistory.find()
      .sort({ timestamp: -1 })
      .limit(5);
    res.json(doubleNumberHistory);
  } catch (error) {
    console.error("Error fetching doubleNumber history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get last 5 tripleNumber results
exports.getTripleNumberHistory = async (req, res) => {
  try {
    const tripleNumberHistory = await SpinnerHistory.find()
      .sort({ timestamp: -1 })
      .limit(5);
    res.json(tripleNumberHistory);
  } catch (error) {
    console.error("Error fetching tripleNumber history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
