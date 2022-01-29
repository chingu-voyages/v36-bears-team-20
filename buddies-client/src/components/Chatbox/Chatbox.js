import { useEffect, useRef, useState } from "react";

import SendIcon from "@mui/icons-material/Send";
import { Avatar, Box, Button, TextField, AppBar, Toolbar } from "@mui/material";

import ChatMsg from "./ChatMsg";

const TopBar = ({ organizerName, onlineStatus }) => {
  return (
    <AppBar position="relative" color="primary">
      <Toolbar>
        <Avatar sx={{ mr: 2 }} />
        {organizerName} | {onlineStatus}
      </Toolbar>
    </AppBar>
  );
};

const ChatMessages = ({ currentUser, messages }) => {
  // Scroll down to latest message
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current && messages?.at(-1)?.user === currentUser) {
      scrollRef.current.scroll({
        top: scrollRef.current.scrollHeight,
        behaviour: "smooth",
      });
    }
  }, [messages, currentUser]);

  // Group consecutive messages from same author
  const groupedMessages = messages.reduce((acc, curr) => {
    if (acc.at(-1)?.at(-1)?.user === curr.user) {
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
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
      }}
      ref={scrollRef}
    >
      {groupedMessages.map((messageGroup, idx) => (
        <ChatMsg
          side={
            messageGroup[0].organizer === messageGroup[0].user
              ? "left"
              : "right"
          }
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

export default function Chatbox({ organizerID, userID }) {
  const organizerName = "Yoda"; // Search by organizerID for organizerName
  const onlineStatus = "online"; // Search by organizerID for onlineStatus
  const currentUser = 20;
  const [messages, setMessages] = useState([
    {
      organizer: 10,
      user: 10,
      event: 20,
      message: "Hi!",
      timestamp: 1643285543,
    },
    {
      organizer: 10,
      user: 10,
      event: 20,
      message: "How's it going?",
      timestamp: 1643285544,
    },
    {
      organizer: 10,
      user: 20,
      event: 20,
      message: "Doing good!",
      timestamp: 1643285545,
    },
    {
      organizer: 10,
      user: 10,
      event: 20,
      message: "Great! See you soon!",
      timestamp: 1643285546,
    },
    {
      organizer: 10,
      user: 20,
      event: 20,
      message: "See you! :)",
      timestamp: 1643285547,
    },
  ]); // Load messages from database

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateAreas: `"header"
  "chat"
  "textinput"`,
        gridTemplateColumns: "auto",
        gridTemplateRows: "64px minmax(0, 1fr) 56px",
        bgcolor: (theme) => theme.palette.background.paper,
        boxShadow: 8,
        borderRadius: 2,
        padding: 0,
        minWidth: 250,
        minHeight: 500,
        maxHeight: 500,
      }}
    >
      <TopBar {...{ organizerName, onlineStatus }} />
      <ChatMessages {...{ currentUser, messages }} />
      <TextInput {...{ setMessages }} />
    </Box>
  );
}
