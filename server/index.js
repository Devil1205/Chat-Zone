const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 5000;
const cors = require('cors');
const { Server } = require("socket.io");
require('./db/connectDB')

app.use(cors({
    origin:'*'
}))
app.use(express.json());
const io = new Server(server,{
    cors: {
        origin: "*",
    }
});

module.exports = io;

//chat-zone
app.use(require('./routes/chat-zone/socket'));

//mChat
require('./routes/mChat/socket');
app.use('/mChatAuthAPI',require('./routes/user/createUser'));
app.use('/mChatAuthAPI',require('./routes/user/loginUser'));
app.use('/mChatAuthAPI',require('./routes/user/verifyUser'));
app.use('/mChatAuthAPI',require('./routes/user/forgotPassword'));
app.use('/mChatMessageAPI',require('./routes/chat/addMessage'));
app.use('/mChatMessageAPI',require('./routes/chat/getMessages'));
app.use('/mChatMessageAPI',require('./routes/chat/userDetails'));

server.listen(port, ()=>{
    console.log("Listening on port "+port);
})