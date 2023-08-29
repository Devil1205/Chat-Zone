import './App.css';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import User from './components/SignupSignin/User';
import socketIO from 'socket.io-client';

function App() {
  // console.log(socket);
  // const socket = socketIO.connect("http://localhost:5000");
  // const socket = socketIO.connect("https://chat-zone-qu4q.onrender.com");
  const socket = socketIO("https://chat-zone.vercel.app",
  { transports: ['websocket', 'polling', 'flashsocket']
  });

  return (
    <Router>
      <Routes>
        <Route exact path ="/" element={<Home socket={socket} / >} />
        <Route exact path ="user" element={<User />} />
      </Routes>
    </Router>
  )
}

export default App
