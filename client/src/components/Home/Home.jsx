import React, { useEffect } from 'react';
import './Home.css';
import { useLocation, useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

function Home({ socket }) {


    const navigate = useNavigate();
    const location = useLocation();
    const name = localStorage.getItem('name');

    const appendMessage = (name, message, state) => {
        const messages = document.querySelector('.messages');
        const newMessage = `<div class=${state}><span>${name} : </span> ${message}</div>`;
        messages.innerHTML += newMessage;
    }

    const joinMessage = (name, message) => {
        const messages = document.querySelector('.messages');
        const newMessage = `<div class="joinMessage">${name} ${message}
            </div>`;
        messages.innerHTML += newMessage;
    }

    useEffect(() => {

        if (name === null)
            navigate('/user');
        else {
            socket.emit("new-user-joined", name);

            socket.on('user-joined', ({ name, message }) => {
                joinMessage(name, message);
            })

            socket.on('receivedMessage', ({ name, message }) => {
                appendMessage(name, message, "received");
            })
            socket.on('sentMessage', ({ name, message }) => {
                appendMessage(name, message, "sent");
            })

            socket.on('user-left', ({ name, message }) => {
                joinMessage(name, message);
            })
        }
        localStorage.clear();
    }, [socket])



    const sendMessage = (e) => {
        e.preventDefault();
        const message = document.getElementById('sendMessage');
        socket.emit("sendMessage", message.value);
        e.target[0].value = "";
    }
    // console.log(name);

    return (
        <div className='home'>
            <div className="logo">
                Welcome To Chat-Zone
            </div>
            <div className="container">
                <div className="messages">
                </div>
                <form className="send" onSubmit={sendMessage}>
                    <input id="sendMessage" type="text" placeholder='chat' />
                    <button className="btn btn-primary submit" type="submit" ><SendIcon fontSize='medium' /></button>
                </form>
            </div>
        </div>
    )
}

export default Home