import React, { useEffect, useState } from 'react'
import './Home.css';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import socketIO from 'socket.io-client';

function Home({ setShowNavbar, base_URL }) {

    let socket;
    const [allChat, setAllChat] = useState([]);
    const [currChat, setCurrChat] = useState([]);

    const BackendURL = "http://localhost:5000";
    const authToken = localStorage.getItem('auth-token');

    const sendMessage = async()=>{

    }

    const getUserDetails = async (receiver) => {
        try {
            // console.log(receiver);
            const body = JSON.stringify({ receiver: receiver });
            const response = await axios.post(BackendURL + "/mChatMessageAPI/userDetails",
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

    const getCurrentChat = async (receiver) => {
        try {
            const body = JSON.stringify({ receiver: receiver });
            const response = await axios.post(BackendURL + "/mChatMessageAPI/messages",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": authToken
                    }
                }
            )
            const temp = await getUserDetails(receiver);
            response.data.name=temp.name;
            response.data.phone=temp.phone;
            setCurrChat(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllChats = async () => {
        try {
            const response = await axios.get(BackendURL + "/mChatMessageAPI/allMessages",
                { headers: { "Content-Type": "application/json", "auth-token": authToken } });
            // console.log(response);

            for (let i = 0; i < response.data.length; i++) {
                const temp = await getUserDetails(response.data[i].receiver);
                response.data[i].phone = temp.phone;
                response.data[i].name = temp.name;
            }
            console.log(response.data);
            setAllChat(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setShowNavbar(true);
        getAllChats();
        socket = socketIO.connect(base_URL+"/chat-zone",{ transports: ['websocket']});
        
        socket.broadcast.emit('new-user-joined', "Pulkit");

        // getUserDetails("651fe6bd3d95d3b297ed7809");
    }, [])

    return (
        <div className='mChat-Home'>
            <div className="chats">
                {/* <div>
                    <h4>8470950994</h4>
                    <div>Hello this is a message Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem sapiente tempore, deserunt doloremque odit, praesentium culpa dolore dicta libero obcaecati ipsam animi cumque vero. Libero eligendi eum ullam tempore molestias.</div>
                </div>
                <div>
                    <h4>8470950994</h4>
                    <div>Hello this is a message</div>
                </div> */}
                {
                    allChat.map((elem, ind) => {
                        return (
                            <div key={ind} onClick={()=>{getCurrentChat(elem.receiver)}}>
                                {/* {console.log(elem)} */}
                                <h4>{elem.phone}</h4>
                                <div>{elem.content}</div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="chat">
                <div className='messages'>
                    {/* <h3 className='text-center'>Pulkit</h3>
                    <div className="sent">
                        Hello
                    </div>
                    <div className="received">
                        HEY
                    </div> */}
                    <h3 className="text-center">{currChat.name}</h3>
                    {
                        currChat.map((elem, ind) => {
                            return (
                                <div key={ind} className={elem.type}>{elem.content}</div>
                            )
                        })
                    }
                </div>
                <form className="mChat-send">
                    <input id="sendMessage" type="text" placeholder='chat' />
                    <button className="btn btn-primary submit" type="submit" ><SendIcon fontSize='medium' /></button>
                </form>
            </div>
        </div>
    )
}

export default Home