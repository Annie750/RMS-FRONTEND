import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const ChartCard = ({ title, subtitle, action, children, height = 320 }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="h6">{title}</Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
        <Box sx={{ width: "100%", height }}>{children}</Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
