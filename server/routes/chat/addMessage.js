const express = require('express');
const router = express.Router();
const Message = require('../../models/messageSchema');
const User = require('../../models/userSchema');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../../middleware/fetchUser');

const saveMessage = async(userId,receiver,content,type)=>{
    //calling api for sender message
    const message = new Message({
        user:{
            id: userId,
            receiver:[{
                id: receiver,
                messages:[{
                    content: content,
                    type: type
                }]
            }]
        }
    });
    
    //checking if sender already exists in db
    const senderExists = await Message.findOne({'user.id': userId});
    if(!senderExists)
    {
        await message.save();
        return ({message: "Sender added successfully"});
    }
    

    let receiverExists = null;
    let receiverIndex=-1;
    senderExists.user.receiver.forEach((elem,ind)=>{
        if(elem.id==receiver)
        {
            receiverIndex=ind;
            receiverExists=elem;
        }
    });
    
    // console.log(receiverExists);
    //to create new receiver chat for sender
    if(!receiverExists)
    {
        const updatedReceiver = senderExists.user.receiver.concat(message.user.receiver[0]);
        // console.log(updatedReceiver);   
        const temp = await Message.findOneAndUpdate({'user.id': userId}, {'user.receiver': updatedReceiver} );
        return ({message: "Receiver added successfully"});
    }
    

    //append new message to already existing chat
    senderExists.user.receiver[receiverIndex].messages = senderExists.user.receiver[receiverIndex].messages.concat(message.user.receiver[0].messages[0]);
    await senderExists.save();
    return ({message: "Message sent successfully"});
}

router.post('/send', fetchUser, [
    body('receiver',"Invalid receiver id").isLength({ min: 24, max: 24 }),
    body('content',"Cannot send empty message").isLength({ min: 1 }),
], async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {content,receiver,type} = req.body;

    const userSnder = await User.findById(req.user.id);
    if(!userSnder)
        return res.status(404).json({messgae: "User doesn't exist"});
    const userReceiver = await User.findById(receiver);
    if(!userReceiver)
        return res.status(404).json({messgae: "User doesn't exist"});

    //calling api for sender message
    await saveMessage(req.user.id,receiver,content,type);
    // await saveMessage(receiver,req.user.id,content,type==="sent"?"received":"sent");
    return res.status(200).json({message: "Message sent successfully"})
})

module.exports = router;