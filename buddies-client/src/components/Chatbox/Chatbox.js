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

async function getChatIds(userid, token) {
  const resp = await axios.get(
    `http://localhost:8000/api/users/${userid}/chatrooms`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

async function getChatRoomMessages(chatroom_id, token) {
  const resp = await axios.get(
    `http://localhost:8000/api/chatrooms/${chatroom_id}/messages`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

async function getEventDetails(eventId, token) {
  const resp = await axios.get(`http://localhost:8000/api/events/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data;
}

async function getUserName(userid, token) {
  const resp = await axios.get(`http://localhost:8000/api/users/${userid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data.username;
}

async function fetchChats(user, token, setChats) {
  const chats = [];
  try {
    if (token && user) {
      // Get current user's chatroom ids
      const chat_ids = await getChatIds(user._id, token);
      console.log(chat_ids);
      for (const chat_id of chat_ids) {
        // Get chatroom messages
        const chatroom_messages = await getChatRoomMessages(chat_id, token);
        const event_details = await getEventDetails(
          chatroom_messages["relatedId"],
          token
        );

        const chatroom = {
          ...{
            hostUserName: await getUserName(chatroom_messages.host, token),
            guestUserName: await getUserName(chatroom_messages.guest, token),
            eventName: event_details.name,
          },
          ...chatroom_messages,
        };

        chats.push(chatroom);
      }
      setChats(chats);
    }
  } catch (e) {
    console.error("unknown error occurred");
  }
}

export default function Chatbox({ socket }) {
  const { user, token, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  console.log(currentChatId);
  const currentChat = chats.find((chat) => chat._id === currentChatId);
  const counterPartyName =
    currentChat !== undefined
      ? currentChat.host === user._id
        ? currentChat.guestUserName
        : currentChat.hostUserName
      : undefined;

  useEffect(() => {
    fetchChats(user, token, setChats);
  }, [user, token, navigate, setToken, currentChatId]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", () => {
        fetchChats(user, token, setChats);
      });
    }
  }, [socket, token, user]);
  /*
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  */
  return (
    <Box sx={{ display: "flex" }}>
      <SideDrawer {...{ chats, setCurrentChatId }} />
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
        {currentChat !== undefined && (
          <>
            <TopBar
              {...{
                counterPartyName: counterPartyName,
                onlineStatus: "online",
              }}
            />
            <ChatMessages
              messages={
                chats.find((chat) => chat["_id"] === currentChatId)?.messages ||
                []
              }
            />
            <TextInput {...{ chatroomId: currentChatId, socket }} />
          </>
        )}
      </Box>
    </Box>
  );
}
