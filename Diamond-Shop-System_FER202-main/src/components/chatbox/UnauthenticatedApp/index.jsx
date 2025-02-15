import GoogleButton from "react-google-button";
import { useAuth } from "../../../hooks/useAuth";
import { Box, Typography, Container, Paper } from "@mui/material";

function UnauthenticatedApp() {
  const { login } = useAuth();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box 
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Typography variant="h4" mb={3}>
            Log in to join a chat room!
          </Typography>
          <GoogleButton onClick={login} />
        </Box>
      </Paper>
    </Container>
  );
}

export { UnauthenticatedApp };
