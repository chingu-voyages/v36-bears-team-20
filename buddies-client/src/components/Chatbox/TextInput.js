import React, { useState } from "react";

import SendIcon from "@mui/icons-material/Send";
import { Box, Button, TextField } from "@mui/material";

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
export default TextInput;
