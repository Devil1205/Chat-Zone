import React from 'react'
import './Home.css';
import SendIcon from '@mui/icons-material/Send';

function Home() {

    return (
        <div className='mChat-Home'>
            <div className="chats">
                <div>
                    <h4>8470950994</h4>
                    <div>Hello this is a message</div>
                </div>
                <div>
                    <h4>8470950994</h4>
                    <div>Hello this is a message</div>
                </div>
            </div>
            <div className="chat">
                <div className='messages'>
                    <h3 className='text-center'>Pulkit</h3>
                    <div className="sent">
                        Hello
                    </div>
                    <div className="received">
                        HEY
                    </div>
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