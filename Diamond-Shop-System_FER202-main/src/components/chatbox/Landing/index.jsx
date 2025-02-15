import { Link } from "react-router-dom";
import { chatRooms } from "../data/chatRooms";
import "./styles.css";
import { Box, Typography, List, ListItem, ListItemText, Paper, Container } from "@mui/material";

function Landing() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box textAlign="center">
          <Typography variant="h4" mb={3}>
            Choose a Chat Room
          </Typography>
          <List className="chat-room-list">
            {chatRooms.map((room) => (
              <ListItem
                key={room.id}
                component={Link}
                to={`/room/${room.id}`}
                button
              >
                <ListItemText primary={room.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
}

export { Landing };
