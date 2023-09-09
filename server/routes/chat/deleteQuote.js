const express = require('express');
const router = express.Router();
const Quote = require('../../models/quote');
const fetchUser = require('../../middleware/fetchUser');

router.delete('/quotifyAPI/quote/:id',fetchUser,async (req,res)=>{
    try {
        let data = await Quote.findById(req.params.id);
        if (!data)
            return res.status(400).json({ error: "The quote doesn't exist" })
        // console.log(data.user.toString());
        if (data.user.toString() !== req.user.id)
            return res.status(501).json({ error: "Access denied" })
        data = await Quote.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Quote deleted successfully"});
    }
    catch(e){
        return res.status(500).json({error: "Internal server error"});
    }
})

module.exports = router;