const express = require('express');
const router = express.Router();
const User = require('../../models/userSchema');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../../middleware/fetchUser');

//get receiver details
router.post('/userDetails', fetchUser, [
    body('receiver', "Invalid receiver id").isLength({ min: 24, max: 24 }),
], async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { receiver } = req.body;

    //checking if sender exists in db
    const user = await User.findById(receiver);
    if (!user) {
        return res.status(404).json({ error: "This user doesn't exist" });
    }

    // console.log(user);
    const userDetails = { name: user.name, phone: user.phone };
    if (req.user.id === receiver)
        userDetails.name += "(You)";
    return res.status(200).json(userDetails);

})

//get a receiver by phone search
router.post('/getReceiver', fetchUser, [
    body('phone', "Invalid phone number").isLength({ min: 10, max: 10 }),
], async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;

    //checking if sender exists in db
    const user = await User.findOne({phone});
    if (!user) {
        return res.status(404).json({ error: "This user doesn't exist" });
    }

    // console.log(user);
    const userDetails = { id: user._id, phone: user.phone, name: user.name };
        return res.status(200).json(userDetails);
})

//get sender user details
router.get('/sender', fetchUser,
    async (req, res) => {
        // console.log(req.body);
        
        //checking if user exists in db
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "This user doesn't exist" });
        }

        // console.log(user);
        const userDetails = { id: req.user.id, name: user.name, phone: user.phone };
        
        return res.status(200).json(userDetails);

    })
module.exports = router;