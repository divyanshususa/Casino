const UserSchema = require("../Schema/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Transaction = require("../Schema/transactions");
const Withdrawal = require("../Schema/withdrawal");

const jwtkey = "ajfhkajlhfkljashdfklashfklshdfliasfdhk";
exports.CreateUser = async (req, res) => {
  try {
    const { username, phone, firstname, lastname, password } = req.body;
    const existingUser = await UserSchema.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    //  const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserSchema({
      username,
      phone,
      firstname,
      lastname,
      password,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log("error while creating user ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.userlogin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  try {
    // Check if the user exists
    const user = await UserSchema.findOne({ username }).populate("bets");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password is correct
    // const isMatch = await bcrypt.compare(password, user.password);

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, jwtkey, { expiresIn: "24h" });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.resetPassword = async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await UserSchema.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getuser = async (req, res) => {
  try {
    const user = await UserSchema.find({});
    res.status(200).json(user);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getuserdetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserSchema.findById({ _id: userId }).populate("bets");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.usernameSuggestions = async (req, res) => {
  try {
    const prefix = req.params.prefix.toLowerCase();

    const existingUsernames = await UserSchema.find({
      username: { $regex: `^${prefix}`, $options: "i" },
    }).select("username");

    let suggestions = [];
    let num = 1;
    const maxDigits = 3;
    const maxAttempts = 5;

    while (suggestions.length < maxAttempts) {
      const randomDigits = Math.floor(Math.random() * Math.pow(10, maxDigits));
      const suggestedUsername = `${prefix}${randomDigits}`;

      if (
        !existingUsernames.some(
          (user) => user.username.toLowerCase() === suggestedUsername
        )
      ) {
        suggestions.push(suggestedUsername);
      }
    }

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.GetUserTransaction = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId })
      .populate("userId")
      .populate("betId");

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

exports.createWithdrawalRequest = async (req, res) => {
  try {
    // const userId = req.user.id; // assuming user ID is available in the request
    const { amount, userId } = req.body;

    const user = await UserSchema.findById(userId);
    if (!user || user.userpoints < amount) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    const withdrawal = new Withdrawal({
      userId,
      amount,
    });

    await withdrawal.save();

    res.status(201).json({ message: "Withdrawal request created", withdrawal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// exports.placebid= async(req, res)=>{
//     const { username, table, number } = req.body;

//     try {

//       const user = await UserSchema.findOne({ username });

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       user.bids.push({ table, number });
//       await user.save();

//       res.status(200).json({ message: 'Bid placed successfully', user });
//     } catch (error) {
//       console.error('Error placing bid:', error);
//       res.status(500).json({ error: 'Failed to place bid' });
//     }
// }

// exports.checkwinner= async(req,res) =>{
//     try {

//         const tripleDigit = Math.floor(Math.random() * 1000); // Random triple-digit number (0-999)
//         const tens = Math.floor((tripleDigit % 100) / 10); // Get tens digit
//         const singleDigit =tripleDigit % 10;
//         const doubleDigit= tens*10 +singleDigit

//      const spinnerResult = {
//       singleDigit,
//       doubleDigit,
//       tripleDigit
//     };

//         const users = await UserSchema.find();

//         let winner = null;

//         for (const user of users) {
//           for (const bid of user.bids) {
//             if (
//               bid.table === 'single-digit' &&
//               bid.number === spinnerResult.singleDigit
//             ) {
//               winner = user;
//               break;
//             } else if (
//               bid.table === 'double-digit' &&
//               bid.number === spinnerResult.doubleDigit
//             ) {
//               winner = user;
//               break;
//             } else if (
//               bid.table === 'triple-digit' &&
//               bid.number ===
//                 spinnerResult.tripleDigit
//             ) {
//               winner = user;
//               break;
//             }
//           }
//           if (winner) {
//             break;
//           }
//         }

//         if (winner) {
//           res.status(200).json({ message: 'Winner found!', winner });
//         } else {
//           res.status(404).json({ message: 'No winner found' });
//         }
//       } catch (error) {
//         console.error('Error checking winner:', error);
//         res.status(500).json({ error: 'Failed to check winner' });
//       }
// }
