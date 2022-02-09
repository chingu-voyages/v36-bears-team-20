import React, { Fragment, useEffect, useRef, useState } from "react";
import { useContext } from "react";

import FolderIcon from "@mui/icons-material/Folder";
import MailIcon from "@mui/icons-material/Mail";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Typography,
  ListSubheader,
} from "@mui/material";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { UserContext } from "../../context/user-context";
import ChatMsg from "./ChatMsg";

const TopBar = ({ counterPartyName, onlineStatus }) => {
  return (
    <AppBar position="relative" color="primary" sx={{ gridArea: "header" }}>
      <Toolbar>
        <Avatar sx={{ mr: 2 }} />
        {counterPartyName} | {onlineStatus}
      </Toolbar>
    </AppBar>
  );
};

const ChatMessages = ({ messages }) => {
  // Automatically scroll down to latest message whenever current user
  // posts a new message
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current && messages?.at(-1)?.from === "self") {
      scrollRef.current.scroll({
        top: scrollRef.current.scrollHeight,
        behaviour: "smooth",
      });
    }
  }, [messages]);

  // Group consecutive messages from same author
  const groupedMessages = messages.reduce((acc, curr) => {
    if (acc.at(-1)?.at(-1)?.from === curr.from) {
      acc.at(-1).push(curr);
    } else {
      acc.push([curr]);
    }
    return acc;
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        gridTemplateRows: "auto",
        overflow: "auto",
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        gridArea: "chat",
      }}
      ref={scrollRef}
    >
      {groupedMessages.map((messageGroup, idx) => (
        <ChatMsg
          side={messageGroup[0].from === "counterParty" ? "left" : "right"}
          key={idx}
          messages={messageGroup.map((m) => m.message)}
        />
      ))}
    </div>
  );
};

const TextInput = ({ setMessages }) => {
  const [inputText, setInputText] = useState("");
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 96px",
        gridTemplateRows: "auto",
        gridArea: "textinput",
      }}
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        setMessages((messages) =>
          messages.concat({
            organizer: 10,
            user: 20,
            event: 20,
            message: inputText,
            timestamp: 1643285547,
          })
        );
        setInputText("");
      }}
    >
      <TextField
        placeholder="Type here..."
        onChange={(e) => {
          setInputText(e.target.value);
        }}
        value={inputText}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disableRipple
        disabled={inputText === ""}
      >
        <SendIcon />
      </Button>
    </Box>
  );
};

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}

export default function Chatbox({ socket }) {
  const { user, token, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [chatsWithHosts, setChatsWithHosts] = useState([
    {
      _id: 1,
      profilePicture: <FolderIcon />,
      username: "Alice",
      eventName: "Party",
      messages: [
        {
          from: "counterParty",
          message: "First chat message 1",
          timestamp: 1643285543,
        },
        {
          from: "counterParty",
          message: "First chat message 2",
          timestamp: 1643285544,
        },
        {
          from: "self",
          message: "First chat message 3",
          timestamp: 1643285545,
        },
        {
          from: "self",
          message: "First chat message 4",
          timestamp: 1643285546,
        },
      ],
      unreadCount: 2,
    },
    {
      _id: 2,
      profilePicture: <FolderIcon />,
      username: "Bob",
      eventName: "Party",
      messages: [
        {
          from: "counterParty",
          message: "Second chat message 1",
          timestamp: 1643285543,
        },
        {
          from: "counterParty",
          message: "Second chat message 2",
          timestamp: 1643285544,
        },
        {
          from: "self",
          message: "Second chat message 3",
          timestamp: 1643285545,
        },
        {
          from: "self",
          message: "Second chat message 4",
          timestamp: 1643285546,
        },
      ],
      unreadCount: 2,
    },
  ]);

  const [currentChatId, setCurrentChatId] = useState(1);

  const [messages, setMessages] = useState([]); // Dummy TODO remove this

  useEffect(() => {
    async function fetchChats(user, token) {
      try {
        if (token && user) {
          // Get current user's chatroom ids
          const chat_ids_resp = await axios.get(
            `http://localhost:8000/api/users/${user._id}/chatrooms`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const chat_ids = chat_ids_resp.data;
          const chatrooms = [];
          for (const chat_id of chat_ids) {
            // Get each chatroom
            const chatroom_resp = await axios.get(
              `http://localhost:8000/api/chatrooms/${chat_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const chatroom = chatroom_resp.data;
            // Get each chatroom's messages
            const chatroom_messages_resp = await axios.get(
              `http://localhost:8000/api/chatrooms/${chat_id}/messages`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            chatrooms.push(chatroom_messages_resp.data);
          }
          console.log(chatrooms);
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
  const drawerWidth = 450;
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>Chats</Toolbar>
        <Divider />
        <List dense={true} subheader={<ListSubheader>My Hosts</ListSubheader>}>
          <Divider />
          {chatsWithHosts.map((chat, index) => (
            <Fragment key={chat.eventName + index}>
              <ListItem
                button
                disableRipple
                alignItems="center"
                onClick={() => {
                  setCurrentChatId(chat._id);
                }}
              >
                <ListItemAvatar>
                  <Avatar>{chat.profilePicture}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Box sx={{ display: "inline" }}>
                      <Typography
                        sx={{ fontWeight: "bold" }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                      >
                        {chat.eventName}
                      </Typography>
                      <Typography sx={{ textDecoration: "underline" }}>
                        {chat.username}
                      </Typography>
                      <Typography>
                        {(chat.messages.at(-1).from === "self"
                          ? `You: `
                          : null) +
                          truncate(chat.messages.at(-1)["message"], 35) || null}
                      </Typography>
                      <Typography fontStyle="italic">
                        {chat.messages.at(-1)["timestamp"] || null}
                      </Typography>
                    </Box>
                  }
                />
                <Badge badgeContent={chat.unreadCount} color="primary">
                  <MailIcon color="action" />
                </Badge>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </Drawer>
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
            counterPartyName: chatsWithHosts.find(
              (chat) => chat._id === currentChatId
            )?.username,
            onlineStatus: "online",
          }}
        />
        <ChatMessages
          {...{
            messages: chatsWithHosts.find(
              (chat) => chat["_id"] === currentChatId
            )?.messages,
          }}
        />
        <TextInput {...{ setMessages }} />
      </Box>
    </Box>
  );
}
