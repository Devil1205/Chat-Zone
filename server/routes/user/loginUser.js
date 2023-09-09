const express = require('express');
const router = express.Router();
const User = require('../../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt_secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

//loginUser Route
router.post('/login',

    //Req Res function
    async (req,res) => {

        //Return if email or phone not unique
        try {
            //checking user credentials
            // console.log(req.body);
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ error: "Invalid email/password" });
            }
            const passCompare = await bcrypt.compare(req.body.password, user.password);
            if (!passCompare) {
                return res.status(400).json({ error: "Invalid email/password" });
            }
            //Return valid user
            const payload = {
                user:{
                    id:user._id
                }
            }
            user = await User.findOne({ email: req.body.email }).select('-password');
            const authToken = jwt.sign(payload,jwt_secret,{expiresIn: "20d"});
            res.status(200).json({user,authToken});
        }
        catch (e) {
            // console.log(e);
            res.status(500).json({ error: "Internal server error" });
        }
    })

module.exports = router;