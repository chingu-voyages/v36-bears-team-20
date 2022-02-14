import React, { useState } from "react";

import SendIcon from "@mui/icons-material/Send";
import { Box, Button, TextField } from "@mui/material";

const TextInput = ({ currentChatId, socket }) => {
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
        socket.emit("sendMessage", {
          chatroomId: currentChatId,
          message: inputText,
        });
        setInputText("");
      }}
    >
      <TextField
        disabled={currentChatId === null}
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
export default TextInput;
