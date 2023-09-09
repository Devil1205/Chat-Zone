const express = require('express');
const router = express.Router();
const fetchUser = require('../../middleware/fetchUser');
const User = require('../../models/userSchema');

//verifyUser Route
router.get('/verifyUser', fetchUser,

    //Req Res function
    async (req,res) => {

        try {
            if(req.user)
            {
                // console.log(req.user); 
                const user = await User.findById(req.user.id).select('-password');
                res.status(200).json(user);
            }
        }
        catch (e) {
            // console.log(e);
            res.status(500).json({ error: "Internal server error" });
        }
    })

module.exports = router;