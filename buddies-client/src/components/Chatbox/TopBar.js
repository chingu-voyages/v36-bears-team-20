import React from "react";

import { Avatar, AppBar, Toolbar, Typography } from "@mui/material";

const TopBar = ({ counterPartyName }) => {
  return (
    <AppBar
      position="relative"
      sx={{ gridArea: "header", background: "#ffab23" }}
    >
      <Toolbar>
        <Avatar sx={{ mr: 2 }} />
        <Typography sx={{ fontWeight: "bold", color: "black" }}>
          {counterPartyName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
