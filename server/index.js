const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 5000;
const cors = require('cors');
const { Server } = require("socket.io");
app.use(express.json());
app.use(cors());
const io = new Server(server,{
    cors: {
        origin: "*",
    }
});

const user = {};

io.on('connection', socket =>{
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

app.get('/ChatZoneAPI/online-users', (req,res)=>{
    const onlineUsers = Object.values(user);
    res.status(200).json({users: onlineUsers});
})


server.listen(port, ()=>{
    console.log("Listening on port "+port);
})