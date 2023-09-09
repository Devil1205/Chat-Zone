import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Main.css'

function ForgotPassword({ base_URL, setShowNavbar, showNavbar, message, updateMessage }) {
    const navigate = useNavigate();

    //Forgot password
    const forgotPass = async (e) => {
        try {
            e.preventDefault();
            const email = document.querySelectorAll('.login input')[0].value;
            const front_URL = window.location.origin+'/#/setPassword';
            const response = await fetch(base_URL + '/mChatAuthAPI/forgotPassword',
                {
                    method: "POST",
                    body: JSON.stringify({ front_URL, email }),
                    headers: { "content-type": "application/json" }
                })
            const responseJson = await response.json();
            if (response.status === 200) {
                updateMessage("success", "Password reset link sent to the above email address.");
                // navigate('/user');
            }
            else {
                updateMessage("error", responseJson.error);
            }
            console.log(responseJson);
        }
        catch (error) {
            console.log(error);
        }
    }

    //form display and navbar hide front end code
    useEffect(() => {
        setShowNavbar(false);
        return () => {
            setShowNavbar(true);
        }
    }, [showNavbar])
    return (
        <div className="user">
            <div className='loginMessage'>
                {message && <div className={`alert alert-${message.type === 'success' ? message.type : "danger"}`} role='alert'>{`${message.type} : ${message.message}`}</div>}
            </div>
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">Forgot Password</div>
                </div>
                <div className="form-container">
                    <div className="form-inner">
                        <form className="login" onSubmit={forgotPass}>
                            <div className="field">
                                <input type="email" placeholder="Enter email id" required />
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" id='login' value="Send reset link" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword