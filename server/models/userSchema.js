const mongoose = require('mongoose');
const User = mongoose.Schema({
    name:{
        type: "string",
        required: true
    },
    email:{
        type: "string",
        required: true,
        unique: true,
    },
    phone:{
        type: "Number",
        required: true,
        unique: true,
    },
    password:{
        type: "string",
        required: true
    }
});

module.exports = mongoose.model("User",User);