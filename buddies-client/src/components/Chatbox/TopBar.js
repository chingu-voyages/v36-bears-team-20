import React from "react";

import { Avatar, AppBar, Toolbar } from "@mui/material";

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
export default TopBar;
