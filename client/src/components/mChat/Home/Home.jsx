import React, { useEffect, useRef, useState } from 'react'
import './Home.css';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import socketIO from 'socket.io-client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function Home({ setShowNavbar, base_URL, verifyUser, message, updateMessage }) {

    const socket = socketIO.connect(base_URL + "/mChat", { transports: ['websocket'] });;
    const [allChat, setAllChat] = useState([]);
    const [currChat, setCurrChat] = useState({ messages: null });
    const [user, setUser] = useState({});
    const [receiverList, setReceiverList] = useState([]);
    // const base_URL = "http://localhost:5000";
    const authToken = localStorage.getItem('auth-token');
    const clickOutside = useRef(null);
    const navigate = useNavigate();

    const logoutUser = () => {
        localStorage.removeItem('auth-token');
        setUser(false);
        updateMessage("success", "Logged out successfully");
        navigate('/mChat/user');
    }

    socket.on('received', async (message) => {
        // console.log(message);
        // const sender = localStorage.getItem('sender') && JSON.parse(localStorage.getItem('sender'));
        console.log(message);
        const receiver = message.sender;
        getCurrentChat(receiver);
        getAllChats();
    })

    const sendMessage = async (formElement, receiver) => {
        try {
            formElement.preventDefault();
            const content = formElement.target.sendMessage.value;
            const type = "sent";
            const body = JSON.stringify({ receiver, content, type });
            const response = await axios.post(base_URL + "/mChatMessageAPI/send",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": authToken
                    }
                }
            )
            const temp = currChat;
            const sender = JSON.parse(localStorage.getItem('sender'));
            temp.messages.push(response.data);
            setCurrChat(temp);
            const receiverMessage = { data: { ...response.data } };
            receiverMessage.data.type = "received";
            receiverMessage.receiver = receiver;
            // console.log(response.data);
            getAllChats();
            socket.emit('sent', { sender: sender.id, receiver });
            formElement.target.reset();
        } catch (error) {
            console.log(error);
        }
    }

    const getUserDetails = async (receiver) => {
        try {
            // console.log(receiver);
            const body = JSON.stringify({ receiver: receiver });
            const response = await axios.post(base_URL + "/mChatMessageAPI/userDetails",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": authToken
                    }
                }
            )
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const getSenderDetails = async () => {
        try {
            // console.log(receiver);
            const response = await axios.get(base_URL + "/mChatMessageAPI/sender",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": authToken
                    }
                }
            )
            localStorage.setItem('sender', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const getCurrentChat = async (receiver) => {
        try {
            const body = JSON.stringify({ receiver: receiver });
            const response = await axios.post(base_URL + "/mChatMessageAPI/messages",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": authToken
                    }
                }
            )
            const temp = await getUserDetails(receiver);
            const sender = localStorage.getItem('sender') && JSON.parse(localStorage.getItem('sender'));
            response.data.name = temp.name;
            response.data.phone = temp.phone;
            // response.data.receiver=receiver;
            // console.log(typeof receiver);
            // console.log(response.data);
            setCurrChat(response.data);
            socket.emit('user-chat', { sender: sender.id, receiver });
            if (media.matches) {
                const chat = document.getElementsByClassName('chat')[0];
                const chats = document.getElementsByClassName('chats')[0];
                chat.style.display = "block";
                chats.style.display = "none";
            }

        } catch (error) {
            console.log(error);
        }
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            const messages = document.getElementsByClassName('messages')[0].childNodes[currChat.messages.length];
            messages.scrollIntoView();
            console.log(messages);
        }, 0);
    };


    const getAllChats = async () => {
        try {
            const response = await axios.get(base_URL + "/mChatMessageAPI/allMessages",
                { headers: { "Content-Type": "application/json", "auth-token": authToken } });
            // console.log(response);

            for (let i = 0; i < response.data.length; i++) {
                const temp = await getUserDetails(response.data[i].receiver);
                response.data[i].phone = temp.phone;
                response.data[i].name = temp.name;
            }
            // console.log(response.data);
            setAllChat(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getReceiverList = async () => {
        try {
            const search = document.getElementById('search');
            const body = JSON.stringify({ search: search.value });
            const response = await axios.post(base_URL + "/mChatMessageAPI/getReceiver",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": authToken
                    }
                }
            )
            // console.log(response.data);
            setReceiverList(response.data);
        }
        catch (err) {
            setReceiverList([]);
            console.log(err);
        }
        finally {
            const search = document.getElementsByClassName('search')[0];
            search.style.display = "block";
        }
    }

    //close search results when clicked outside
    const handleClick = (e) => {
        const search = document.getElementsByClassName('search')[0];
        if (!clickOutside.current.contains(e.target))
            search.style.display = "none";
        // console.log(clickOutside.current.contains(e.target));
    }

    const media = window.matchMedia('(max-width: 658px)');
    // console.log(media);

    const goToAllChatMobile = () => {
        if (media.matches) {
            const chat = document.getElementsByClassName('chat')[0];
            const chats = document.getElementsByClassName('chats')[0];
            chat.style.display = "none";
            chats.style.display = "block";
        }
        setCurrChat({ messages: null });
    }

    const verify = async () => {
        const result = await verifyUser();
        // console.log(result);
        setUser(result);
    }

    useEffect(() => {
        setShowNavbar(true);
        if (!authToken)
            navigate('/mChat/user')
        getSenderDetails();
        getAllChats();
        // socket.on('sendMessage', "Pulkit");
        socket.emit("user-online", "hey");
        const search = document.getElementsByClassName('search')[0];
        verify();
        search.addEventListener('click', handleClick);
        return () => {
            search.removeEventListener('click', handleClick);
        }

    }, [])

    return (
        <div className='mChat-Home'>
            <div className='message'>
                {message && <div className={`alert alert-${message.type === 'success' ? message.type : "danger"}`} role='alert'>{`${message.type} : ${message.message}`}</div>}
            </div>
            <div className="chats">
                <div className='homeMenu'>
                    <div className='searchBar'>
                        <input type="text" id='search' placeholder='search' onChange={getReceiverList} />
                    </div>
                    <div className="dropdown">
                        <svg className='bi bi-three-dots-vertical dropdown-toggle' data-bs-auto-close="outside" type="button" data-bs-toggle="dropdown" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        </svg>
                        <ul className="dropdown-menu" style={{ maxWidth: "250px", overflow: "auto" }}>
                            <li><div className="dropdown-item">{user.name}</div></li>
                            {/* <li><div className="dropdown-item">{user.email}</div></li> */}
                            <li><div className="dropdown-item">{user.phone}</div></li>
                            <li><button className="dropdown-item" onClick={logoutUser}>Logout</button></li>
                        </ul>
                    </div>
                    <div className="search">
                        <div className="results" ref={clickOutside}>
                            {receiverList.length > 0 ? receiverList.map((receiver, index) => {
                                return (
                                    <div key={index}>
                                        <div>{receiver.name}</div>
                                        <div onClick={() => { getCurrentChat(receiver._id) }}>Chat</div>
                                    </div>
                                )
                            }) : <div>Not found</div>}
                        </div>
                    </div>
                </div>
                {/* <div>
                    <h4>8470950994</h4>
                    <div>Hello this is a message Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem sapiente tempore, deserunt doloremque odit, praesentium culpa dolore dicta libero obcaecati ipsam animi cumque vero. Libero eligendi eum ullam tempore molestias.</div>
                </div>
                <div>
                    <h4>8470950994</h4>
                    <div>Hello this is a message</div>
                </div> */}
                <div className='allChats'>
                    {
                        allChat.map((elem, ind) => {
                            return (
                                <div key={ind} onClick={() => { getCurrentChat(elem.receiver) }}>
                                    {/* {console.log(elem)} */}
                                    <h4>{elem.name}</h4>
                                    <div>{elem.content}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="chat">
                {
                    currChat.messages ? <>
                        <div className='messages'>
                            {/* <h3 className='text-center'>Pulkit</h3>
                    <div className="sent">
                        Hello
                    </div>
                    <div className="received">
                        HEY
                    </div> */}
                            <div className="nameHeading">
                                <div className="backButton" onClick={goToAllChatMobile}>
                                    <ArrowBackIcon fontSize='large' sx={{ color: "white" }} />
                                </div>
                                <h3 className="text-center">{currChat.name}</h3>
                            </div>
                            {
                                currChat.messages.map((elem, ind) => {
                                    if (ind === currChat.messages.length - 1) { scrollToBottom() }
                                    return (
                                        <div key={ind} className={elem.type}>{elem.content}</div>
                                    )
                                })
                            }
                        </div>
                        <form className="mChat-send" onSubmit={(e) => { sendMessage(e, currChat.receiver) }}>
                            <input id="sendMessage" type="text" placeholder='chat' name='sendMessage' />
                            <button className="btn btn-primary submit" type="submit" ><SendIcon fontSize='medium' /></button>
                        </form>
                    </> :
                        <>
                            <h3 className='text-center'>Welcome to mChat</h3>
                            <h5 className='text-center'>A quick way to connect</h5>
                        </>
                }
            </div>
        </div>
    )
}

export default Home