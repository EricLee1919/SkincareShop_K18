import React from 'react';
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const ChatBoxButton = () => {
  return (
    <Button
      component={Link}
      to="/chatbox"
      variant="contained"
      sx={{
        position: "fixed",
        bottom: "75px",
        right: "21px",
        backgroundColor: "#B19567",
        color: "white",
        fontWeight: "700",
        fontSize: "14px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        minWidth: "unset",
        "&:hover": {
          backgroundColor: "#2c3e50",
          color: "white",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}
    >
      Chat
    </Button>
  );
};

export default ChatBoxButton;
