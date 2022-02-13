import React, { Fragment } from "react";

import {
  Avatar,
  Box,
  Toolbar,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  ListSubheader,
} from "@mui/material";

function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

function timeConverter(UNIX_timestamp) {
  const a = new Date(UNIX_timestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();

  const ampm = hour >= 12 ? "PM" : "AM";
  hour %= 12;
  hour = hour || 12;
  min = min < 10 ? `0${min}` : min;

  const todaysDate = new Date();
  const sameDay =
    todaysDate.getDate() === date &&
    todaysDate.getMonth() === month &&
    todaysDate.getFullYear() === year;

  const timestamp = `${
    sameDay ? date + " " + month + " " + year + " " : ""
  }${hour}:${min} ${ampm}`;

  return timestamp;
}

const SideDrawer = ({ chatsAsGuest, chatsAsHost, setCurrentChatId }) => {
  const drawerWidth = 450;

  const chats = [
    {
      subheader: "My Hosts",
      chats: chatsAsGuest,
    },
    { subheader: "My Guests", chats: chatsAsHost },
  ].filter((e) => e.chats.length);

  return (
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
      {chats.map((e) => (
        <List
          key={e.subheader}
          dense={true}
          subheader={<ListSubheader>{e.subheader}</ListSubheader>}
        >
          <Divider />
          {e.chats.map((chat, index) => (
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
                      <Typography sx={{ fontWeight: "bold" }}>
                        {e.subheader === "My Hosts"
                          ? chat.hostUserName
                          : chat.guestUserName}{" "}
                        @ {chat.eventName}
                      </Typography>
                      <Typography sx={{ color: "#595a5c" }}>
                        {truncate(chat.messages?.at(-1)?.["message"], 35) || ``}
                      </Typography>
                    </Box>
                  }
                />
                <Typography fontStyle="italic">
                  {timeConverter(chat.messages?.at(-1)?.["timestamp"]) || null}
                </Typography>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      ))}
    </Drawer>
  );
};
export default SideDrawer;
