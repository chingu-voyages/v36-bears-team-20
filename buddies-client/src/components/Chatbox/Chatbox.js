import React, { useEffect, useState } from "react";
import { useContext } from "react";

import { Box } from "@mui/material";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { UserContext } from "../../context/user-context";
import ChatMessages from "./ChatMessages";
import SideDrawer from "./SideDrawer";
import TextInput from "./TextInput";
import TopBar from "./TopBar";

async function getChatIds(userid, token) {
  const resp = await axios.get(
    `${
      process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
    }/api/users/${userid}/chatrooms`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

async function getChatRoomMessages(chatroom_id, token) {
  const resp = await axios.get(
    `${
      process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
    }/api/chatrooms/${chatroom_id}/messages`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

async function getEventDetails(eventId, token) {
  const resp = await axios.get(
    `${
      process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
    }/api/events/${eventId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data;
}

async function getUserName(userid, token) {
  const resp = await axios.get(
    `${
      process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
    }/api/users/${userid}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return resp.data.username;
}

async function getChats(chat_ids, token) {
  const chats = [];
  for (const chat_id of chat_ids) {
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
  return chats;
}

async function fetchChats(
  user,
  token,
  setChatsAsGuest,
  setChatsAsHost,
  setLoaded
) {
  try {
    if (token && user) {
      // Get current user's chatroom ids
      const chat_ids = await getChatIds(user._id, token);
      const chat_ids_as_guest = chat_ids["chatroomsAsGuest"];
      const chat_ids_as_host = chat_ids["chatroomsAsHost"];
      // Get current user's chatrooms
      const chats_as_guest = await getChats(chat_ids_as_guest, token);
      const chats_as_host = await getChats(chat_ids_as_host, token);

      setChatsAsGuest(chats_as_guest);
      setChatsAsHost(chats_as_host);
      setLoaded(true);
    }
  } catch (e) {
    console.error("unknown error occurred");
  }
}

export default function Chatbox({ socket }) {
  const { user, token, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [chatsAsGuest, setChatsAsGuest] = useState([]);
  const [chatsAsHost, setChatsAsHost] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchChats(user, token, setChatsAsGuest, setChatsAsHost, setLoaded);
  }, [user, token, navigate, setToken, currentChatId]);

  useEffect(() => {
    const receiveMessage = ({ from, timestamp, chatroomId, message, _id }) => {
      // Find relevant chatroom
      const chatIdxGuest = chatsAsGuest.findIndex((e) => e._id === chatroomId);
      const chatIdxHost = chatsAsHost.findIndex((e) => e._id === chatroomId);
      const chatIdx = chatIdxGuest === -1 ? chatIdxHost : chatIdxGuest;
      // Append message to the relevant chatroom
      if (chatIdxGuest === -1) {
        return setChatsAsHost((e) => {
          const chats = e;
          if (chats[chatIdx]["messages"].at(-1)["_id"] !== _id) {
            chats[chatIdx]["messages"] = chats[chatIdx]["messages"].concat([
              { from, message, timestamp, _id },
            ]);
          }

          return JSON.parse(JSON.stringify(chats));
        });
      } else {
        return setChatsAsGuest((e) => {
          const chats = e;
          if (chats[chatIdx]["messages"].at(-1)["_id"] !== _id) {
            chats[chatIdx]["messages"] = chats[chatIdx]["messages"].concat([
              { from, message, timestamp, _id },
            ]);
          }
          return JSON.parse(JSON.stringify(chats));
        });
      }
    };

    if (loaded && socket) {
      // Update local cache of messages when any message is received from socket
      socket.on("receiveMessage", (e) => receiveMessage(e));

      return () => {
        // turning of socket listener on unmount
        socket.off("chatMessage", (e) => receiveMessage(e));
      };
    }
  }, [socket, chatsAsGuest, chatsAsHost, loaded]);

  // Is the user a guest in the current chat?
  const currentChatAsGuest = chatsAsGuest.some(
    (chat) => chat._id === currentChatId
  );
  // Is the user a host in the current chat?
  const currentChatAsHost = chatsAsHost.some(
    (chat) => chat._id === currentChatId
  );

  // Get the current chatroom
  const currentChat = currentChatAsGuest
    ? chatsAsGuest.find((chat) => chat._id === currentChatId)
    : currentChatAsHost
    ? chatsAsHost.find((chat) => chat._id === currentChatId)
    : undefined;

  // current chat messages
  const messages = currentChat?.messages;

  // Name to display on top of chat bar
  const counterPartyName =
    currentChat !== undefined
      ? currentChatAsGuest
        ? currentChat.hostUserName // If user is a guest talking to host, show host's name
        : currentChat.guestUserName // If user is a host talking to a guest, show guest's name
      : undefined;

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <SideDrawer {...{ chatsAsGuest, chatsAsHost, setCurrentChatId }} />
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
              }}
            />
            <ChatMessages messages={messages} userid={user._id} />
            <TextInput {...{ currentChatId, socket }} />
          </>
        )}
      </Box>
    </Box>
  );
}
