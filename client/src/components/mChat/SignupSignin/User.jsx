import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Main.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function User({ base_URL, setShowNavbar, showNavbar, message, updateMessage }) {
    const navigate = useNavigate();
    const location = useLocation();
    let loginText;
    let loginForm;
    //form display and navbar hide front end code
    useEffect(() => {
        setShowNavbar(false);
        loginText = document.querySelector(".title-text .login");
        loginForm = document.querySelector("form.login");
        return () => {
            setShowNavbar(true);
        }
    }, [showNavbar])

    //logging in user using login api endpoint
    const loginUser = async (e) => {
        e.preventDefault();
        const email = document.querySelectorAll('.login input')[0].value;
        const password = document.querySelectorAll('.login input')[1].value;
        // console.log(password.value);
        const data = {
            email,
            password
        };
        try {
            navigate('/mChat');
            // const response = await fetch(base_URL + '/mChatAuthAPI/login',
            //     {
            //         method: "POST",
            //         body: JSON.stringify(data),
            //         headers: { "content-type": "application/json" }
            //     })
            // //Navigate user to his account if credentials are correct
            // const responseJson = await response.json();
            // // console.log(responseJson);
            // if (response.status === 200) {
            //     localStorage.setItem('auth-token', JSON.stringify({ user: responseJson.user.name, token: responseJson.authToken }));
            //     navigate('/mChat');
            // }
            // else {
            //     updateMessage("error", responseJson.error);
            // }
            // console.log(responseJson);
        }
        catch (error) {
            console.log(error);
        }
    }

    //registering new user using register api endpoint
    const registerUser = async (e) => {
        e.preventDefault();
        const name = document.querySelectorAll('.signup input')[0].value;
        const email = document.querySelectorAll('.signup input')[1].value;
        const phone = document.querySelectorAll('.signup input')[2].value;
        const password = document.querySelectorAll('.signup input')[3].value;
        // console.log(password.value);
        const data = {
            name,
            email,
            phone,
            password
        };
        console.log(data);
        try {
            const response = await fetch(base_URL + '/mChatAuthAPI/register',
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: { "content-type": "application/json" }
                })
            const responseJson = await response.json();
            if (response.status === 200) {
                updateMessage("success", "User Created Successfully, kindly login");
            }
            else {
                updateMessage("error", responseJson.error);
            }
            // console.log(response);
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="user">
            <div className="backButton" onClick={() => { navigate(-1) }}><ArrowBackIcon fontSize='large' sx={{ color: "white" }} /></div>
            <div className='loginMessage'>
                {message && <div className={`alert alert-${message.type === 'success' ? message.type : "danger"}`} role='alert'>{`${message.type} : ${message.message}`}</div>}
            </div>
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">Login Form</div>
                    <div className="title signup">Signup Form</div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" defaultChecked />
                        <input type="radio" name="slide" id="signup" />
                        <label htmlFor="login" className="slide login" onClick={() => {
                            loginForm.style.marginLeft = "0%";
                            loginText.style.marginLeft = "0%";
                        }}>Login</label>
                        <label htmlFor="signup" id='slideToSignup' className="slide signup" onClick={() => {
                            loginForm.style.marginLeft = "-50%";
                            loginText.style.marginLeft = "-50%";
                        }}>Signup</label>
                        <div className="slider-tab"></div>
                    </div>
                    <div className="form-inner">
                        <form className="login" onSubmit={(e) => { loginUser(e) }}>
                            <div className="field">
                                <input type="email" placeholder="Email Address" required />
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Password" required />
                            </div>
                            <div className="pass-link"><Link to="/forgotPassword">Forgot password?</Link></div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" id='login' value="Login" />
                            </div>
                        </form>
                        <form className="signup" onSubmit={(e) => { registerUser(e) }}>
                            <div className="field">
                                <input type="text" placeholder="Name" required />
                            </div>
                            <div className="field">
                                <input type="email" placeholder="Email Address" required />
                            </div>
                            <div className="field">
                                <input type="phone" placeholder="Phone" required />
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Password" required />
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input id='register' type="submit" value="Signup" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User