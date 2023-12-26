const express = require('express');
const router = express.Router();
const Message = require('../../models/messageSchema');
const User = require('../../models/userSchema');
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
    const userExists = await User.findById(req.user.id);
    if (!userExists) {
        return res.status(404).json({ error: "Unauthorized access" });
    }

    const senderExists = await Message.findOne({ 'user.id': req.user.id });
    if (!senderExists) {
        const temp = { messages: [], receiver };
        return res.json(temp);
        // return res.status(404).json({ error: "Unauthorized access" });
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
        const temp = { messages: [], receiver };
        return res.json(temp);
    }


    //finding that particular uesr chat
    // const temp=[{receiver}].concat(senderExists.user.receiver[receiverIndex].messages);
    const temp = { messages: senderExists.user.receiver[receiverIndex].messages, receiver };
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

        for (const elem of senderExists.user.receiver) {
            const lastMessage = elem.messages[elem.messages.length - 1];
            try {
                const online = await User.findById(elem.id);
                const updatedLastMessage = {
                    receiver: elem.id,
                    content: lastMessage.content,
                    type: lastMessage.type,
                    date: lastMessage.date,
                    online: {
                        isOnline: online.isOnline,
                        lastActive: online.lastActive
                    }
                };
                // console.log(online);
                // console.log(updatedLastMessage);
                allMessages.push(updatedLastMessage);
            }
            catch (e) {
                console.log(e);
                return res.status(404).json(allMessages);
            }
        }

        return res.status(200).json(allMessages);
    })
module.exports = router;