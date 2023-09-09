const express = require('express');
const router = express.Router();
const Quote = require('../../models/quote');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../../middleware/fetchUser');

router.post('/quotifyAPI/quote', fetchUser, [
    body('author',"Name must be atleast 6 characters").isLength({ min: 6 }),
    body('description',"Quote must be atleast 10 characters").isLength({ min: 10 }),
], async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //if same quote already exists
    const isUnique = await Quote.find({ description: req.body.description });
    if (isUnique.length !== 0) {
        return res.status(400).json({error:"Sorry this quote already exists"});
    }

    const quote = new Quote({
        author: req.body.author,
        description: req.body.description,
        user: req.user.id,
    });
    await quote.save();
    return res.json({message: "Quote added successfully"});
})

module.exports = router;