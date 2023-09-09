const express = require('express');
const router = express.Router();
const User = require('../../models/userSchema');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

//newUser Route
router.post('/register',
//Validation part
[
    body('name',"Name must be atleast 4 characters").isLength({
        min: 4
    }),
    body('email',"Please enter a valid email").isEmail(),
    body('password',"Password must be atleast 6 characters").isLength({
        min: 6
    }),
    body('phone', "Please enter a valid phone number").isNumeric().isLength({
        min: 10,
        max: 10,
    }),
],
//Req Res function
async (req,res)=>{

    //Return express validator errors
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        // console.log(errors);
        return res.status(400).json(errors);
    }

    // Return if email or phone not unique
    if(await User.findOne({email: req.body.email}))
    {
        return res.status(400).json({error: "Email already exists"})
    }
    if(await User.findOne({phone: req.body.phone}))
    {
        return res.status(400).json({error: "Phone number already exists"})
    }

    //Hash password
    const salt = await bcrypt.genSalt(5);
    const secPass = await bcrypt.hash(req.body.password,salt);

    //Generate user model and save
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: secPass,
    })
    // console.log(user);
    try{
        await user.save();
        res.status(200).json({message:"User registered successfully"});
    }
    catch(e){
        res.status(500).json({error: "Internal server error"});
        console.log(e);
    }
})

module.exports = router;