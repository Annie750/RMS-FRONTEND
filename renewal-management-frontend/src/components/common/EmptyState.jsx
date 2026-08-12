import React from "react";
import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

const EmptyState = ({ title = "No data found", subtitle = "There is nothing to show here yet.", icon }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 1.5,
        color: "text.secondary"
      }}
    >
      {icon || <InboxOutlinedIcon sx={{ fontSize: 56, opacity: 0.4 }} />}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
        {title}
      </Typography>
      <Typography variant="body2">{subtitle}</Typography>
    </Box>
  );
};

export default EmptyState;
