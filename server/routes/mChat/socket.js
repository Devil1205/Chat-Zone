const io = require('../../index');
const fetch = require('node-fetch');

const sockets = {};

io.of('/mChat').on('connection', socket=>{
    // console.log(socket);
        
        socket.on('user-chat', async ({receiver,sender})=>{
            sockets[sender]=socket.id;
            // console.log(sockets);
        })
        
        socket.on('sent', message=>{
            socket.to(sockets[message.receiver]).emit('received',message);
            // console.log(message.receiver);
    })
})