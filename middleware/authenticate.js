const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.body.mytoken || req.query.mytoken || req.cookies.mytoken;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("(verifyToken)", verifyToken);
    console.log("user Varified");
    const rootUser = await User.findOne({
      email: verifyToken.email,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("user not found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    req.userEmail = rootUser.email;

    next();
  } catch (error) {
    res.status(401).send("Unauthorized token ");
    console.log(error);
  }
};

module.exports = Authenticate;
