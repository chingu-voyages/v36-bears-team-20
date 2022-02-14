import { ListItem } from "@mui/material";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const ChatMsg = (props) => {
  const { messages, userid, index, style } = props;
  const side = messages[0].from !== userid ? "left" : "right";

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <Grid
        container
        direction="row"
        spacing={0}
        justifyContent={side === "right" ? "flex-end" : "flex-start"}
      >
        <Grid
          item
          xs={12}
          container
          direction="column"
          alignItems={side === "right" ? "flex-end" : "flex-start"}
        >
          {messages.map((m, idx) => (
            <Box
              key={idx}
              textAlign="left"
              marginLeft="20px"
              marginRight="20px"
            >
              <Typography
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  paddingLeft: 2,
                  paddingRight: 2,
                  borderRadius: 2,
                  marginTop: 1,
                  marginBottom: 1,
                  wordBreak: "break-word",
                  fontFamily:
                    // eslint-disable-next-line max-len
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  fontSize: "1rem",
                  backgroundColor: side === "left" ? "#f0f1f1" : "#014a99",
                  color: side === "left" ? "#000" : "#fff",
                }}
              >
                {m.message}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </ListItem>
  );
};
export default ChatMsg;
