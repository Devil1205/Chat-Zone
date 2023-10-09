const express = require('express');
const router = express.Router();
const User = require('../../models/userSchema');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../../middleware/fetchUser');

//get particular user chat messages
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
    const userDetails = {name: user.name, phone: user.phone};
    if(req.user.id===receiver)
        userDetails.name+="(You)";
    return res.status(200).json(userDetails);

})
module.exports = router;