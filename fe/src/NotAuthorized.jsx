import { Box, Typography } from "@mui/material";

const NotAuthorized = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
    >
      <Typography variant="h4" color="error">
        Access Denied
      </Typography>
      <Typography variant="body1">
        You do not have permission to view this page.
      </Typography>
    </Box>
  );
};

export default NotAuthorized;
