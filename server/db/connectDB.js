const mongoose = require('mongoose');
require("dotenv").config();
const key = process.env.MONGO;
// const key = "mongodb://localhost:27017/mChat";

mongoose.connect(key)
.then(()=>{console.log("Connected to MongoDB")})
.catch((e)=>{console.log(e)});

module.exports = mongoose;