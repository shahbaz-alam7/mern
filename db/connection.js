const mongoose = require("mongoose");
const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection succesfull");
  })
  .catch((err) => {
    console.log("Connetion failed----", err);
  });
/*
{useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology:true,
useFindAndModify:false}
*/
