import React, { useEffect, useState } from 'react';
import './Home.css';
import { useLocation, useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';

function Home({ socket }) {


    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const name = localStorage.getItem('name');

    const appendMessage = (name, message, state) => {
        const messages = document.querySelector('.messages');
        const newMessage = `<div class=${state}><span>${name} : </span> ${message}</div>`;
        messages.innerHTML += newMessage;
    }

    const joinMessage = async (name, message) => {
        const messages = document.querySelector('.messages');
        try{
        const response = await fetch("https://chat-zone-qu4q.onrender.com/ChatZoneAPI/online-users");
        const responsJson = await response.json();
        setUsers(responsJson.users);
        }
        catch(e){
            console.log(e);
        }
        const newMessage = `<div class="joinMessage">${name} ${message}
            </div>`;
        messages.innerHTML += newMessage;
    }

    const onlineUsers = () => {
        const online = document.querySelector('.users');
        console.log("online");
        if (online.style.width === "0px")
        {
            online.style.width = "250px";
            online.style.height = "300px";
        }
        else
        {
            online.style.width = "0px";
            online.style.height = "0px";
        }
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
            <div className="online">
                <div id="onlineBtn" onClick={onlineUsers}></div>
                <div className="users">
                    <h3>Online Users</h3>
                    <div>
                        {
                            users.map((user,index) => {
                                return(
                                    <div key={index}>{index+1}. {user}</div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
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