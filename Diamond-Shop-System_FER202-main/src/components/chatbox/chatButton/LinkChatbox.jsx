import { AuthenticatedApp } from "../AuthenticatedApp/index.jsx";
import { UnauthenticatedApp } from "../UnauthenticatedApp/index.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { Box } from "@mui/material";

function LinkChatbox() {
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      
    >
      <h1>Chat Room</h1>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Box>
  );
}

export default LinkChatbox;
