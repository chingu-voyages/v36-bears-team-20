import "./App.css";
import { useEffect, useState } from "react";
import { useContext } from "react";

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import io from "socket.io-client";

import "react-toastify/dist/ReactToastify.css";
import Chatbox from "./components/Chatbox/Chatbox";
import Home from "./components/Home";
import Login from "./components/Login";
import Map from "./components/Map";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import Register from "./components/Register";
import { UserContext } from "./context/user-context";

function App() {
  const { token } = useContext(UserContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8000/message", {
      auth: { token: `Bearer ${token}` },
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, token]);

  return (
    <>
      <ToastContainer
        limit={1}
        position="top-center"
        newestOnTop
        hideProgressBar={false}
        autoClose={4000}
      />

      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Home />} exact />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<Map />} />
        <Route path="/chat" element={<Chatbox socket={socket} />} />
      </Routes>
    </>
  );
}

export default App;
