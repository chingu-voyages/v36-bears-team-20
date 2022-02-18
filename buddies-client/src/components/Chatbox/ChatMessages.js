import { useCallback, useState } from "react";

import { Box, List } from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";

import ChatMsg from "./ChatMsg";

const ChatMessages = ({ messages, userid }) => {
  // Automatically scroll down to latest message whenever any user
  // posts a new message, or when chat messages is first loaded
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useCallback(
    (node) => {
      if (!loaded && node) {
        setLoaded(true);
        node.scroll({
          top: node.scrollHeight,
          behaviour: "auto",
        });
      } else if (node && messages && userid) {
        node.scroll({
          top: node.scrollHeight,
          behaviour: "smooth",
        });
      }
    },
    [messages, userid, loaded]
  );

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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      <AutoSizer>
        {({ height, width }) => (
          <List
            sx={{ height: height, width: width, overflow: "auto" }}
            ref={scrollRef}
          >
            {groupedMessages.map((messages, index) => (
              <ChatMsg
                key={index}
                index={index}
                userid={userid}
                style={{}}
                messages={messages}
              />
            ))}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
};

export default ChatMessages;
