const UserSchema= require('../Schema/user')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../Schema/transactions');
const Withdrawal = require('../Schema/withdrawal');
const PointUpdate = require('../Schema/pointstatus');

const jwtkey = 'ajfhkajlhfkljashdfklashfklshdfliasfdhk'
exports.adminlogin=async(req,res)=>{
    const { username, password } = req.body;
console.log(username )
    try {
        // Check if the user exists
        const user = await UserSchema.findOne({ username , isAdmin: true})

        if (!user) {
            return res.status(404).json({ message: 'admin not found' });
        }

        // Check if the provided password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, jwtkey, { expiresIn: '24h' });

        res.status(200).json({ token ,user});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.deleteUser = async(req,res)=>{
    try {
        const user = await UserSchema.findByIdAndDelete(req.params.id);
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.send('User deleted successfully');
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
}
exports.CreateAdmin = async (req, res) => {
    try {
        const {
            username,
            phone,
            password,
            

        } = req.body
       const existingUser = await UserSchema.findOne({username})
       if(existingUser){
        return res.status(400).json({ error: 'User already exists' });
       }

       const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserSchema({
            username,
            phone,
          isAdmin: true,
            password :hashedPassword,
        });

        await newUser.save();
        res.status(201).json(newUser);

    } catch (error) {
        console.log("error while creating user ", error)
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.allUsers= async(req,res)=>{
    try {
        const users = await UserSchema.find({isAdmin:false})
        // console.log(users)
        res.status(200).json(users)
    } catch (error) {
       console.log(error)
       res.status(500).json({ message: 'Internal Server Error' });
    }
}



const adjectives = ["Swift", "Silent", "Brave", "Mighty", "Fierce", "Noble", "Valiant", "Bold", "Clever", "Witty"];
const nouns = ["Warrior", "Ninja", "Ranger", "Knight", "Sorcerer", "Rogue", "Hunter", "Samurai", "Mage", "Assassin"];

const generateReadableUsername = () => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const uniqueSuffix = Math.floor(Math.random() * 90) + 10;// Get the first part of the UUID
  return `${randomAdjective}${randomNoun}${uniqueSuffix}`;
};

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
  
  
exports.createRandomUser= async (req, res) => {
    try {
        const username = generateReadableUsername();
        const password = generateRandomString(6);



        const user = await UserSchema.findOne({ phone: req.body.phone })
        console.log(user)
        if (user) {
            return res.status(409).json({ message: ' user Already found' });
        }

    //   const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserSchema({
        username: username,
        password: password,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        gender:req.body.gender,
        phone: req.body.phone || null,  
        userpoints: req.body.userpoints,
        amountWin: 0,
        isAdmin: false,
        bets: []
      });
  
      await newUser.save();
  
      res.status(201).json({
        message: 'User created successfully',
        user: {
          username: newUser.username,
          password: password,
          phone: newUser.phone,
          userpoints: newUser.userpoints,
          amountWin: newUser.amountWin,
          isAdmin: newUser.isAdmin
          
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  


  exports.UpdateUserPoints= async(req, res)=>{

    try {
        const userId = req.params.userId;
        const { userpoints } = req.body;
     
        if (typeof userpoints !== 'number') {
          return res.status(400).json({ message: 'User points must be a number' });
        }
    
        const user = await UserSchema.findByIdAndUpdate(
            userId,
            { $inc: { userpoints: userpoints } },
            { new: true, runValidators: true }
          );
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const pointUpdate = new PointUpdate({
            userId,
            pointsProvided: userpoints
          });
          await pointUpdate.save();
        res.status(200).json({
          message: 'User points updated successfully',
        
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }

  }

  exports.getAllPointTransactions = async (req, res) => {
    try {
      const transactions = await PointUpdate.find().populate('userId').sort({ timestamp: -1 });
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  

  exports.getAllWithdrawalRequests = async (req, res) => {
    try {
      const withdrawals = await Withdrawal.find().populate('userId').sort({ createdAt: -1 });
      res.status(200).json(withdrawals);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };


  
  exports.updateWithdrawalStatus = async (req, res) => {
    try {
      const { withdrawalId, status } = req.body;
  
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const withdrawal = await Withdrawal.findByIdAndUpdate(
        withdrawalId,
        { status, updatedAt: Date.now() },
        { new: true }
      );
  
      if (status === 'approved') {
        const user = await UserSchema.findById(withdrawal.userId);
        user.userpoints -= withdrawal.amount;
        await user.save();
      }
  
      res.status(200).json({ message: 'Withdrawal status updated', withdrawal });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  
  
//   exports.Expenditure= async(req, res)=>{
//     try {
//         const totalExpenditure = await Transaction.aggregate([
//           {
//             $group: {
//               _id: null,
//               totalAmountPlayed: { $sum: '$amountPlayed' },
//               totalAmountWon: { $sum: '$amountWin' }
//             }
//           }
//         ]);
    
//         res.status(200).json(totalExpenditure[0]);
//       } catch (error) {
//         console.error('Error fetching total expenditure:', error);
//         res.status(500).json({ error: 'Failed to fetch total expenditure' });
//       }
//   }

exports.Expenditure=async(req,res)=>{
    try {
        const result = await Transaction.aggregate([
          {
            $group: {
              _id: null,
              totalAmountPlayed: { $sum: '$amountPlayed' },
              totalAmountWon: { $sum: '$amountWin' }
            }
          }
        ]);
    
        if (result.length === 0) {
          return res.status(200).json({
            totalAmountPlayed: 0,
            totalAmountWon: 0,
            totalEarnings: 0,
            totalExpenditure: 0
          });
        }
    
        const totalAmountPlayed = result[0].totalAmountPlayed;
        const totalAmountWon = result[0].totalAmountWon;
        const totalExpenditure = totalAmountPlayed;
        const totalEarnings = totalAmountPlayed - totalAmountWon;
    
        res.status(200).json({
          totalAmountPlayed,
          totalAmountWon,
          totalEarnings,
          totalExpenditure
        });
      } catch (error) {
        console.error('Error fetching total expenditure and earnings:', error);
        res.status(500).json({ error: 'Failed to fetch total expenditure and earnings' });
      }
}


exports.GetAllTransaction=async(req,res)=>{

  
    try {
      const transactions = await Transaction.find()
        .populate('userId') 
        .populate('betId').sort({ createdAt: -1 }); 
  transactions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }