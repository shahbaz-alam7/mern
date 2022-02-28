const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
// dotenv.config({ path: "./config.env" });
// const PORT = process.env.PORT;
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;

// ? Getting connection
require("./db/connection");
// to get response
app.use(express.json());

// ? Model
// const User = require("./model/userSchema");

// ? Middleware2 of router
app.use(require("./router/auth"));

// ? middleware

// app.get("/", (req, res) => {
//   res.send("Home page");
// });
// app.get("/about", (req, res) => {
//   res.cookie("SetCookie", "shahbaz");
//   res.send("About page");
// });
// app.get("/signin", (req, res) => {
//   res.send("Login page");
// });
// app.get("/signup", (req, res) => {
//   res.send("SignUp page");
// });
// app.get("/user", (req, res) => {
//   res.send("User page");
// });


if(process.env.NODE_ENV=="production"){
  app.use(express.static("client/build"));
}

app.listen(PORT, () => {
  console.log(`Server starting at port ${PORT}`);
});
