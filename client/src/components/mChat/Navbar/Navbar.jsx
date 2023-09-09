import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar({ verifyUser, message, updateMessage }) {

    const [user, setUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        (async () => {
            const result = await verifyUser();
            // console.log(result);
            if (result !== false) {
                setUser(result);
            }
        })();
    }, [])

    const logoutUser = ()=>{
        localStorage.removeItem('auth-token');
        setUser(false);
        updateMessage("success","Logged out successfully")
    }

    const location = useLocation();
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
            <div className='message'>
                {message && <div className={`alert alert-${message.type==='success'?message.type:"danger"}`} role='alert'>{`${message.type} : ${message.message}`}</div>}
            </div>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Quotify</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/quotes' ? 'active' : ""}`} to="quotes">All Quotes</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/my_quotes' ? 'active' : ""}`} to="my_quotes">My Quotes</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/new_quote' ? 'active' : ""}`} to="new_quote">Write a Quote</Link>
                        </li>
                        <div className='profile me-4'>
                            {user === false ? <AccountCircleIcon fontSize='large' color='primary' onClick={() => { navigate('/user') }} /> :
                                <li className="nav-item dropdown">
                                    <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Profile
                                    </div>
                                    <ul className="dropdown-menu">
                                        <li><div className="dropdown-item">{user.name}</div></li>
                                        <li><div className="dropdown-item">{user.email}</div></li>
                                        <li><div className="dropdown-item">{user.phone}</div></li>
                                        <li><div className="dropdown-item" onClick={logoutUser}>Logout</div></li>
                                    </ul>
                                </li>}
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar