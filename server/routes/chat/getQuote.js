const express = require('express');
const router = express.Router();
const Quote = require('../../models/quote');
const fetchUser = require('../../middleware/fetchUser');

//Get a random quote
router.get('/quotifyAPI/', async (req, res) => {
    const quote = await Quote.find();
    const rNum = Math.floor(Math.random() * quote.length);
    res.json(quote[rNum]);
})

//Get all user quotes
router.get('/quotifyAPI/quotes',async (req,res)=>{
    const quote = await Quote.find();
    res.json(quote);
})

//Get logged in user quotes
router.get('/quotifyAPI/myQuotes',fetchUser,async (req,res)=>{
    try {
        const data = await Quote.find({user: req.user.id});
        res.status(200).json(data);
    }
    catch(e){
        return res.status(500).json({error: "Internal server error"});
    }
})

module.exports = router;