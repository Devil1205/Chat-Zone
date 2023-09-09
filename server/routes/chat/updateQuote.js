const express = require('express');
const router = express.Router();
const Quote = require('../../models/quote');
const fetchUser = require('../../middleware/fetchUser');

router.patch('/quotifyAPI/quote/:id', fetchUser, async (req, res) => {
    try {
        let data = await Quote.findById(req.params.id);
        if (!data)
            return res.status(400).json({ error: "The quote doesn't exist" })
        // console.log(data.user.toString());
        if (data.user.toString() !== req.user.id)
            return res.status(501).json({ error: "Access denied" })
        if (req.body.author && req.body.author.length>4)
            data.author = req.body.author;
        if (req.body.description && req.body.description.length>10)
            data.description = req.body.description;
        data = await Quote.findByIdAndUpdate(req.params.id, data);
        // console.log(data);
        return res.status(200).json({message:"Updated Quote Successfully"});
    }
    catch (e) {
        res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = router;