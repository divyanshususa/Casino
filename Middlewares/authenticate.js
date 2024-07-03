const jwt = require('jsonwebtoken');
const userdb = require('../Schema/user');
const secretkey = "ajfhkajlhfkljashdfklashfklshdfliasfdhk";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log("inside..", token);
        
        const verifyToken = jwt.verify(token, secretkey);
        console.log("...>", verifyToken)

        if (!verifyToken) {
            throw new Error("Invalid token");
        }

        if (verifyToken.userId) {
            const rootUser = await userdb.findOne({ _id: verifyToken.userId });
            console.log(rootUser)
            if (!rootUser) {
                throw new Error("User not found");
            }
 
            req.token = token;
            req.rootUser = rootUser;
            req.userId = rootUser._id;
        } 
        
            else {
            throw new Error("Invalid token");
        }

        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ status: 401, message: "Unauthorized access" });
    }
};

module.exports = authenticate;
