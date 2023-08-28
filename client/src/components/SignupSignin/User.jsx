import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Main.css'

function User() {
    const navigate = useNavigate();
    const location = useLocation();
    let loginText;
    let loginForm;
    //form display and navbar hide front end code
    useEffect(() => {
        loginText = document.querySelector(".title-text .login");
        loginForm = document.querySelector("form.login");
    }, [])

    //logging in user using login api endpoint
    const loginUser = async (e) => {
        e.preventDefault();
        const name = document.querySelectorAll('.login input')[0].value;
        localStorage.setItem('name', name);
        navigate('/');
    }

    //registering new user using register api endpoint
    const registerUser = async (e) => {
        e.preventDefault();
    }


    return (
        <div className="user">
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
                                <input type="text" placeholder="Name" required />
                            </div>
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