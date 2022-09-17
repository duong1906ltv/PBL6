import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from "./views/pages/chat";
import Home from "./views/pages/home";
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:5000');
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/chat" element={<Chat socket = {socket} />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
