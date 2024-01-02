import './App.css';
import Home from './components/Home/Home';
import ChatZoneUser from './components/ChatZone/SignupSignin/User';
import ChatZoneHome from './components/ChatZone/Home/Home';
import { HashRouter as Router, Route, Routes, json } from 'react-router-dom';
import { useState } from 'react';
import MChatUser from './components/mChat/SignupSignin/User';
import MChatHome from './components/mChat/Home/Home';
import SetPassword from './components/mChat/SignupSignin/SetPassword';
import ForgotPassword from './components/mChat/SignupSignin/ForgotPassword';

function App() {

  const base_URL = "http://localhost:5000";
  // const base_URL = "https://chat-zone-qu4q.onrender.com";

  const [message, setMessage] = useState("");
  const updateMessage = (type, message) => {
    setMessage({ type, message });
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  //Check valid user using authtoken
  const verifyUser = async () => {
    try {
      const authToken = !localStorage.getItem('auth-token') ? "" : localStorage.getItem('auth-token');
      const response = await fetch(base_URL + "/mChatAuthAPI/verifyUser/", {
        method: "GET",
        headers: { "Content-type": "application/json", "auth-token": authToken }
      })
      // console.log(response);
      if (response.status !== 200)
        return false;
      const responseJson = await response.json();
      return responseJson;
    }
    catch (e) {
      console.log(e);
    }
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home base_URL={base_URL} />} />
        <Route exact path="/chat-zone/" element={<ChatZoneHome base_URL={base_URL} />} />
        <Route exact path="/chat-zone/user" element={<ChatZoneUser />} />
        <Route exact path="/mChat/" element={<MChatHome verifyUser={verifyUser} message={message} updateMessage={updateMessage} base_URL={base_URL} />} />
        <Route exact path="/mChat/home" element={<MChatHome verifyUser={verifyUser} message={message} updateMessage={updateMessage} base_URL={base_URL} />} />
        <Route exact path="/mChat/user" element={<MChatUser base_URL={base_URL} message={message} updateMessage={updateMessage} />} />
        <Route exact path="/mChat/forgotPassword" element={<ForgotPassword base_URL={base_URL} message={message} updateMessage={updateMessage} />} />
        <Route exact path="/mChat/setPassword/:token" element={<SetPassword base_URL={base_URL} message={message} updateMessage={updateMessage} />} />
      </Routes>
    </Router>
  )
}

export default App
