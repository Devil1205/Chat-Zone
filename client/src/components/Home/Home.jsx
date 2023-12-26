import React, { useEffect } from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();
    const navigateTomChat = () => {
        navigate('/mChat/');
    }
    const navigateToChatZone = () => {
        navigate('/chat-zone/user');
    }

    return (
        <div className='myHome'>
            <div className="btn btn-primary" onClick={navigateToChatZone}>ChatZone</div>
            <div className="btn btn-success" onClick={navigateTomChat}>mChat</div>
        </div>
    )
}

export default Home