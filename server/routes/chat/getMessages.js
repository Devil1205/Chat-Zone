const express = require('express');
const router = express.Router();
const Message = require('../../models/messageSchema');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../../middleware/fetchUser');

//get particular user chat messages
router.post('/messages', fetchUser, [
    body('receiver', "Invalid receiver id").isLength({ min: 24, max: 24 }),
], async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { receiver } = req.body;

    //checking if sender exists in db
    const senderExists = await Message.findOne({ 'user.id': req.user.id });
    if (!senderExists) {
        return res.status(404).json({ error: "This chat doesn't exist" });
    }


    let receiverExists = null;
    let receiverIndex = -1;
    senderExists.user.receiver.forEach((elem, ind) => {
        if (elem.id == receiver) {
            receiverIndex = ind;
            receiverExists = elem;
        }
    });

    // console.log(receiverExists);
    //cehcking if receiver exists
    if (!receiverExists) {
        // console.log(updatedReceiver);   
        return res.status(404).json({ error: "This chat doesn't exist" });
    }


    //finding that particular uesr chat
    // const temp=[{receiver}].concat(senderExists.user.receiver[receiverIndex].messages);
    const temp={messages: senderExists.user.receiver[receiverIndex].messages, receiver};
    // console.log(temp);
    return res.json(temp);

})

//get all user chat messages
router.get('/allMessages', fetchUser,
    async (req, res) => {

        // console.log(req.body);
        //checking if sender exists in db
        const senderExists = await Message.findOne({ 'user.id': req.user.id });
        if (!senderExists) {
            return res.status(404).json([]);
        }

        const allMessages = [];

        senderExists.user.receiver.forEach((elem, ind) => {
            const lastMessage = elem.messages[elem.messages.length-1];
            const updatedLastMessage = {
                receiver: elem.id,
                content: lastMessage.content,
                type: lastMessage.type,
                date: lastMessage.date
            };
            // console.log(updatedLastMessage);
            allMessages.push(updatedLastMessage);
        })
        return res.status(200).json(allMessages);
    })
module.exports = router;