const io = require('../../index');

io.of('mChat').on('connection', socket=>{

    socket.on('new-user-joined', message=>{
        socket.broadcast.emit('user-online',true);
    })
})
