import React, { useEffect, useState } from "react";
import { useContext } from "react";

import { Box } from "@mui/material";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { UserContext } from "../../context/user-context";
import ChatMessages from "./ChatMessages";
import SideDrawer from "./SideDrawer";
import TextInput from "./TextInput";
import TopBar from "./TopBar";

const { io } = require("socket.io-client");

export default function Chatbox({ socket }) {
  const { user, token, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [chatsAsHost, setChatsAsHost] = useState([]);
  const [chatsAsGuest, setChatsAsGuest] = useState([]);

  const [currentChatId, setCurrentChatId] = useState(null);

  const [messages, setMessages] = useState([]); // Dummy TODO remove this

  useEffect(() => {
    async function fetchChats(user, token) {
      const chatsAsGuest = [];
      const chatsAsHost = [];
      try {
        if (token && user) {
          // Get current user's chatroom ids
          const chat_ids_resp = await axios.get(
            `http://localhost:8000/api/users/${user._id}/chatrooms`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          for (const chat_id of chat_ids_resp.data) {
            // Get chat messages
            const chatroom_messages_resp = await axios.get(
              `http://localhost:8000/api/chatrooms/${chat_id}/messages`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // Get hostUserId
            const event_resp = await axios.get(
              `http://localhost:8000/api/events/${chatroom_messages_resp.data["relatedId"]}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // Get hostUserName
            const host_resp = await axios.get(
              `http://localhost:8000/api/users/${event_resp.data.userId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const chatroom = {
              ...{
                hostId: event_resp.data.userId,
                hostUserName: host_resp.data.username,
                eventName: event_resp.data.name,
              },
              ...chatroom_messages_resp.data,
            };

            if (chatroom["hostId"] === user._id) {
              chatsAsHost.push(chatroom);
            } else {
              chatsAsGuest.push(chatroom);
            }
          }
          setChatsAsHost(chatsAsHost);
          setChatsAsGuest(chatsAsGuest);
        }
      } catch (e) {
        console.error("unknown error occurred");
      }
    }

    fetchChats(user, token);
  }, [user, token, navigate, setToken]);
  /*
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  */
  return (
    <Box sx={{ display: "flex" }}>
      <SideDrawer {...{ chatsAsGuest, setCurrentChatId }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateAreas: `"header"
                              "chat"
                              "textinput"`,
          gridTemplateColumns: "auto",
          gridTemplateRows: "64px minmax(0, 1fr) 56px",
          bgcolor: (theme) => theme.palette.background.paper,
          padding: 0,
          minHeight: "100vh",
          flexGrow: 1,
        }}
      >
        <TopBar
          {...{
            counterPartyName: chatsAsGuest.find(
              (chat) => chat._id === currentChatId
            )?.hostUserName,
            onlineStatus: "online",
          }}
        />
        <ChatMessages
          messages={
            chatsAsGuest.find((chat) => chat["_id"] === currentChatId)
              ?.messages || []
          }
        />
        <TextInput {...{ setMessages }} />
      </Box>
    </Box>
  );
}
