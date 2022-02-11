import React, { useEffect, useRef } from "react";

import ChatMsg from "./ChatMsg";

const ChatMessages = ({ messages, userid }) => {
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
          side={messageGroup[0].from !== userid ? "left" : "right"}
          key={idx}
          messages={messageGroup.map((m) => m.message)}
        />
      ))}
    </div>
  );
};

export default ChatMessages;
