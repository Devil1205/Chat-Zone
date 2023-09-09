import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Main.css'

function User() {
    const navigate = useNavigate();
    //login user
    const loginUser = async (e) => {
        e.preventDefault();
        const name = document.querySelectorAll('.login input')[0].value;
        localStorage.setItem('name', name);
        navigate('/');
    }


    return (
        <div className="user">
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">Login Form</div>
                </div>
                <div className="form-container">
                    <div className="form-inner">
                        <form className="login" onSubmit={(e) => { loginUser(e) }}>
                            <div className="field">
                                <input type="text" placeholder="Name" required />
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" id='login' value="Login" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User