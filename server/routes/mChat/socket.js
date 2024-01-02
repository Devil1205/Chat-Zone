const io = require('../../index');
const User = require('../../models/userSchema');

const sockets = {};
const users = {};

io.of('/mChat').on('connection', socket => {
    // console.log(socket.id);

    socket.on('user-online', async (id) => {
        users[socket.id]=id;
        const user = await User.findById(id);
        user.isOnline=true;
        await user.save();
        // console.log(id);
        socket.broadcast.emit('user-joined');
        socket.emit('user-joined');
    })

    socket.on('disconnect', async () => {
        const user = await User.findById(users[socket.id]);
        // console.log(socket.id);
        try{
            user.isOnline=false;
            user.lastActive=Date.now();
            await user.save();
        }
        catch(e)
        {}
        socket.broadcast.emit('user-left');
    })

    socket.on('user-left', async (id) => {
        const user = await User.findById(id);
        // console.log(socket.id);
        try{
            user.isOnline=false;
            user.lastActive=Date.now();
            await user.save();
        }
        catch(e)
        {}
        socket.broadcast.emit('user-left');
    })

    socket.on('user-chat', async ({ receiver, sender }) => {
        sockets[sender] = socket.id;
        // console.log(sockets);
    })

    socket.on('sent', message => {
        socket.to(sockets[message.receiver]).emit('received', message);
        // console.log(message.receiver);
    })
})