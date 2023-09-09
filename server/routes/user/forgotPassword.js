const express = require('express');
const router = express.Router();
const User = require('../../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt_secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { body, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'quotifyorg@gmail.com',
        pass: 'qdfgydqsdrnvmoxn'
    }
});

//forgotPassword Route
router.post('/forgotPassword',

    //Req Res function
    async (req, res) => {

        //Return if email is not registered
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "The user doesn't exist" })
        }
        try {
            const payload = {
                user: {
                    id: user._id
                }
            }
            const authToken = jwt.sign(payload, jwt_secret, { expiresIn: "5min" });
            const message = {
                from: "quotifyorg@gmail.com",
                to: user.email,
                subject: "Forgot Password - mChat",
                text: `Hi, you have requested for forgot password on mChat  for the account with email address ${user.email}. Please use the below link to reset the password of your account. 

Link - ${req.body.front_URL}/${authToken}
Kindly note the link is only valid for 5 minutes.`, 
            };
            const send = await transporter.sendMail(message);
            return res.status(200).json({ message: "Reset link has been sent to the above email address" });
        }
        catch (e) {
            // console.log(e);
            return res.status(500).json({ error: "Internal server error" })
        }
    })

//setPassword Route
router.post('/setPassword/:token',

    [
        body('password', "Password must be atleast 6 characters").isLength({
            min: 6
        }),
    ],
    //Req Res function
    async (req, res) => {

        //return if token has expired
        try {
            const authToken = req.params.token;
            // console.log(authToken);
            if (!authToken) {
                return res.status(401).json({ error: "Invalid link, please use the link sent via email" });
            }
            const data = jwt.verify(authToken, jwt_secret);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.log(errors);
                return res.status(400).json(errors);
            }
            //Hash password
            const salt = await bcrypt.genSalt(5);
            const secPass = await bcrypt.hash(req.body.password, salt);
            const user = await User.findByIdAndUpdate(data.user.id, { password: secPass });
            return res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            return res.status(401).json({ error: "Sorry, the link is invalid" });
        }
    })

module.exports = router;