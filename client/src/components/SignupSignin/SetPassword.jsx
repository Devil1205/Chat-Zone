import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Main.css'

function SetPassword({ base_URL, setShowNavbar, showNavbar, message, updateMessage }) {
    const navigate = useNavigate();
    const {token} = useParams();

    const setPassword = async (e) => {
        e.preventDefault();
        const password = document.querySelectorAll('.login input')[0].value;
        const cPassword = document.querySelectorAll('.login input')[1].value;
        // console.log(password.value);
        
        if(password!==cPassword)
        {
            updateMessage("error","Passwords do not match");
            return ;
        }
        try {
            const response = await fetch(base_URL + `/quotifyAuthAPI/setPassword/${token}`,
                {
                    method: "POST",
                    body: JSON.stringify({password}),
                    headers: { "content-type": "application/json" }
                })
            const responseJson = await response.json();
            if (response.status === 200) {
                updateMessage("success", "Password changed successfully");
                navigate('/user');
            }
            else {
                updateMessage("error", responseJson.error);
            }
            // console.log(responseJson);
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
                {message && <div className={`alert alert-${message.type==='success'?message.type:"danger"}`} role='alert'>{`${message.type} : ${message.message}`}</div>}
            </div>
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">Reset Password</div>
                </div>
                <div className="form-container">
                    <div className="form-inner">
                        <form className="login" onSubmit={setPassword}>
                            <div className="field">
                                <input type="password" placeholder="Enter New Password" required />
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Confirm Password" required />
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

export default SetPassword