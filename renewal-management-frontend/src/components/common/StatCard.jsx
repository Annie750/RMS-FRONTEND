import React from "react";
import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color = "primary", trend }) => {
  return (
    <Card component={motion.div} whileHover={{ y: -3 }} transition={{ duration: 0.2 }} sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="body2"
                sx={{ mt: 0.5, color: trend.startsWith("-") ? "error.main" : "success.main", fontWeight: 600 }}
              >
                {trend}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 46, height: 46 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
