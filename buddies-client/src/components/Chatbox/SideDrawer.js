import React, { Fragment } from "react";
import { useContext } from "react";

import MailIcon from "@mui/icons-material/Mail";
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
  Badge,
  Typography,
  ListSubheader,
} from "@mui/material";

import { UserContext } from "../../context/user-context";

function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

const SideDrawer = ({ chats, setCurrentChatId }) => {
  const { user } = useContext(UserContext);
  const drawerWidth = 450;
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
      <List dense={true} subheader={<ListSubheader>My Hosts</ListSubheader>}>
        <Divider />
        {chats.map((chat, index) => (
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
                      {(chat.messages?.at(-1)?.from === user._id
                        ? `You: `
                        : null) +
                        truncate(chat.messages?.at(-1)?.["message"], 35) ||
                        null}
                    </Typography>
                    <Typography fontStyle="italic">
                      {chat.messages?.at(-1)?.["timestamp"] || null}
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
  );
};
export default SideDrawer;
