import React from "react";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { withStyles } from "@mui/styles";
import cx from "clsx";
import PropTypes from "prop-types";

import defaultChatMsgStyles from "./defaultChatMsg.styles";

const ChatMsg = withStyles(defaultChatMsgStyles, { name: "ChatMsg" })(
  (props) => {
    const { classes, messages, side, GridContainerProps, getTypographyProps } =
      props;

    return (
      <Grid
        container
        spacing={2}
        justify={side === "right" ? "flex-end" : "flex-start"}
        {...GridContainerProps}
      >
        <Grid item xs={12}>
          {messages.map((msg, i) => {
            const TypographyProps = getTypographyProps(msg, i, props);
            return (
              <Box key={msg.id || i} className={classes[`${side}Row`]}>
                <Typography
                  align={"left"}
                  {...TypographyProps}
                  className={cx(
                    classes.msg,
                    classes[side],
                    TypographyProps.className
                  )}
                >
                  {msg}
                </Typography>
              </Box>
            );
          })}
        </Grid>
      </Grid>
    );
  }
);
ChatMsg.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
  side: PropTypes.oneOf(["left", "right"]),
  GridContainerProps: PropTypes.shape({}),
  getTypographyProps: PropTypes.func,
};
ChatMsg.defaultProps = {
  messages: [],
  side: "left",
  GridContainerProps: {},
  getTypographyProps: () => ({}),
};
export default ChatMsg;
