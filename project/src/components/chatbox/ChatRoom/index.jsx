import { Link, useParams } from "react-router-dom";
import { chatRooms } from "../data/chatRooms.jsx";
import { MessageInput } from "../../../pages/users/MessageInput/index.jsx";
import { MessageList } from "../../../pages/users/MessageList/index.jsx";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";

function ChatRoom() {
  const params = useParams();

  const room = chatRooms.find((x) => x.id === params.id);
  if (!room) {
    // TODO: 404
  }

  return (
    <>
      <Container>
        <Box
          sx={{
            backgroundColor: "#B19567",
            textAlign: "center",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            pt: 0.25,
            pb: 2,
            position: "relative",
            mt: 2,
          }}
        >
          <Button
            component={Link}
            to="/"
            disableRipple
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              color: "white",
              "&:hover": {
                color: "black",
                backgroundColor: "transparent",
              },
            }}
          >
            <KeyboardArrowLeftIcon />
            Home Page
          </Button>
          <h2>{room.title}</h2>
        </Box>
        <Divider />
        <Paper elevation={0} sx={{ backgroundColor: "#f0f2f5" }}>
          <div className="messages-container">
            <MessageList roomId={room.id} />
            <MessageInput roomId={room.id} />
          </div>
        </Paper>
      </Container>
    </>
  );
}

export { ChatRoom };
