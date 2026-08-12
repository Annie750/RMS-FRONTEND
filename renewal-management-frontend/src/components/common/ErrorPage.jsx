import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ code = 404, message = "Page not found" }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "background.default"
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "5rem", fontWeight: 800, color: "primary.main" }}>
        {code}
      </Typography>
      <Typography variant="h5" color="text.secondary">
        {message}
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default ErrorPage;
