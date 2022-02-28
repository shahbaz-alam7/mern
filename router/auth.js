const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const router = express.Router();
require("../db/connection");
const User = require("../model/userSchema");

// ! store data in databaase using async await
router.post("/register", async (req, res) => {
  const { name, phone, email, work, password, cpassword } = req.body;

  if (!name || !phone || !email || !work || !password || !cpassword) {
    return res.status(422).json({ error: "plz fill all the feild" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ msg: "password are not same" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      // const token = await user.generateAuthToken();
      // res.cookie("mytoken", token, {
      //   expires: new Date(Date.now() + 25892000000),
      //   httpOnly: true,
      // });
      await user.save();
      res.status(201).json({ message: "Data saved in database" });
    }
  } catch (error) {
    res.send({ Error: error });
    console.log(error);
  }
});

//sign in
router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "please fill all the feilds" });
    }
    const result = await User.findOne({ email: email });
    if (result) {
      // Varify user
      const isMatch = await bcrypt.compare(password, result.password);
      // geerate token
      token = await result.generateAuthToken();
      // console.log(token);

      res.cookie("mytoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      // console.log(isMatch);
      if (!isMatch) {
        res.status(400).json({ error: "Invalid crendentials" });
      } else {
        res.json({ message: "Logged in" });
        console.log("Logged in");
      }
    } else {
      return res.status(400).json({ msg: "email not found" });
    }
  } catch (error) {
    console.log("error", error);
  }
});

// About us page

router.get("/about", authenticate, (req, res) => {
  // res.cookie("SetCookie", "shahbaz");
  // console.log("req.rootUser", req.rootUser);
  res.send(req.rootUser);
});

router.get("/getData", authenticate, (req, res) => {
  res.send(req.rootUser);
  // console.log("hello get contact data from get Api");
});
// !contact data
router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, msg } = req.body;
    if (!email || !phone || !msg || !name) {
      console.log("error in contact form");
      return res.json({ msg: "Plz fill all the feilds" });
    }
    const userContact = await User.findOne({ _id: req.userID });
    if (userContact) {
      const userMsg = await userContact.addMsg(name, email, phone, msg);
      await userContact.save();
      res.status(201).json({ output: "user msg received successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("mytoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
