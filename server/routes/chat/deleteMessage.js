const express = require('express');
const router = express.Router();
const Message = require('../../models/messageSchema');
const User = require('../../models/userSchema');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../../middleware/fetchUser');

router.delete('/message', fetchUser, [
    body('receiver', "Invalid receiver id").isLength({ min: 24, max: 24 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { receiver, message } = req.body;

    //checking if sender already exists in db
    try {
        // console.log(req.body);
        const senderExists = await Message.findOne({ 'user.id': req.user.id });
        if (!senderExists)
            return res.status(404).json({ message: "User not found" });

        let receiverExists = null;
        let receiverIndex = -1;
        senderExists.user.receiver.forEach((elem, ind) => {
            if (elem.id == receiver) {
                receiverIndex = ind;
                receiverExists = elem;
            }
        });

        //if receiver not exists in sender's chat
        if (!receiverExists)
            return res.status(404).json({ message: "User not found" });

        let messageDeleted = false;

        message.forEach((messageElem, messageInd) => {
            senderExists.user.receiver[receiverIndex].messages.forEach((elem, ind) => {
                if (elem._id == messageElem.id && messageElem.selected === true) {
                    messageDeleted = true;
                    senderExists.user.receiver[receiverIndex].messages.splice(ind,1);
                    // console.log(senderExists.user.receiver[receiverIndex].messages[ind]);
                }
            })
        })
        if (messageDeleted === true)
        {
            await senderExists.save();
            return res.status(200).json({ message: "Message deleted successfully" });
        }
        return res.status(404).json({ message: "No message found" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;