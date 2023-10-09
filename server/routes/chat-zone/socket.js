const io = require("../../index");
const express = require('express');
const router = express.Router();

const user = {};
io.of('chat-zone').on('connection', socket =>{
    socket.on('new-user-joined', name=>{
        user[socket.id]=name;
        socket.broadcast.emit('user-joined',{name,message: "joined"});
        socket.emit('user-joined',{name: "You", message: "joined"});
    })
    
    socket.on('sendMessage',message=>{
        socket.broadcast.emit('receivedMessage',{name: user[socket.id], message});
        socket.emit('sentMessage',{name: "You", message});
    })

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('user-left',{name: user[socket.id],message: "left"});
        delete user[socket.id];
        socket.emit('user-left',{name: "You", message: "left"});
    })
})

router.get('/ChatZoneAPI/online-users', (req,res)=>{
    const onlineUsers = Object.values(user);
    res.status(200).json({users: onlineUsers});
})

module.exports = router;